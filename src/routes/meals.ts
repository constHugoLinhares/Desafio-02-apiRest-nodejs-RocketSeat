import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { knex } from '../database';
import { checkSessionIdExists } from '../middlewares/check-session-id-exists';

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async(request) => {
      const { sessionId } = request.cookies;

      const meals = await knex('meals').where('session_id', sessionId).select();

      return { meals };
    },
  );

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async(request) => {
      const getMealsParamsSchema = z.object({
        id: z.string().uuid(),
      });

      const { id } = getMealsParamsSchema.parse(request.params);

      const { sessionId } = request.cookies;

      const meals = await knex('meals')
        .where({
          session_id: sessionId,
          id,
        })
        .first();

      return { meals };
    },
  );
  
  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async(request) => {
      const { sessionId } = request.cookies;

      const summary = {
        totalMeals: 0,
        totalMealsInDiet: 0,
        totalMealsOutDiet: 0,
        bestSequence: 0,
      };

      const meals = await knex('meals')
        .where('session_id', sessionId)
        .select({
          description: 'description',
          inDiet: 'inDiet',
        });

      for (const meal of meals) {
        summary.totalMeals++;

        if (meal.inDiet === 1) {
          summary.totalMealsInDiet++;
          summary.bestSequence++;
        } else {
          summary.totalMealsOutDiet++;
          summary.bestSequence = 0;
        }
      }

      return { summary };
    },
  );

  app.post(
    '/',
    async(request,reply) => {
      const createMealsBodySchema = z.object({
        description: z.string(),
        inDiet: z.boolean(),
      });

      const { description, inDiet } = createMealsBodySchema.parse(request.body,);

      const sessionId = request.cookies.sessionId;

      if (!sessionId) {
        return reply.status(401).send({
          error: 'No Session ID provided! / No user',
        });
      }

      await knex('meals').insert({
        id: randomUUID(),
        description,
        inDiet,
        session_id: sessionId,
      });

      return reply.status(201).send();
    }    
  );
}
