// Frameworks
import { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';

// database | middlewares
import { knex } from '../database';
import { checkSessionIdExists } from '../middlewares/check-session-id-exists';

// date 
import moment from 'moment';

// schemas
import { getMealsParamsSchema } from '../schemas/getMealsParams';
import { getMealsBodySchema } from '../schemas/getMealsBody';

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async(request, reply) => {
      const { sessionId } = request.cookies;

      const meals = await knex('meals').where('session_id', sessionId).select();
      if (meals.length <= 0) return reply.status(406).send({
        error: 'No meal yet!',
      });
      return { meals };
    },
  );

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async(request) => {
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

  app.put(
    '/edit/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async(request, reply) => {
      const updated_at = moment().format('YYYY-MM-DD HH:mm:ss');

      const { id } = getMealsParamsSchema.parse(request.params);

      const { description, inDiet } = getMealsBodySchema.parse(request.body);      

      const { sessionId } = request.cookies;

      const meal = await knex('meals')
        .where({
          session_id: sessionId,
          id: id,
        })
        .first();

      await knex('meals')
        .update({
          description,
          inDiet,
          updated_at,
        })
        .where({
          session_id: sessionId,
          id,
        });

      return reply.status(202).send({
        message: `Success on edit the meal: ${meal.description}`,
      });
    },
  );
  
  app.post(
    '/',
    async(request,reply) => {
      const { description, inDiet } = getMealsBodySchema.parse(request.body,);

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
  
  app.delete(
    '/delete/:id',
    async(request, reply) => {
      const { id } = getMealsParamsSchema.parse(request.params);

      const { sessionId } = request.cookies;

      const meals = await knex('meals')
        .where({
          session_id: sessionId,
          id: id,
        })
        .first();
      
      if (meals.length <= 0) {
        return reply.status(406).send({
          message: 'Meal doesn\'t exist!',
        });
      }

      await knex('meals')
        .where({
          session_id: sessionId,
          id,
        })
        .del();

      return reply.status(200).send({
        message: `Success on delete the meal: ${meals.description}`,
      });
    }
  );
}
