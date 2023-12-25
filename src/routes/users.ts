import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { knex } from '../database';
import { checkSessionIdExists } from '../middlewares/check-session-id-exists';

export async function usersRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async(request) => {
      const { sessionId } = request.cookies;

      const users = await knex('users').where('session_id', sessionId).select();

      return { users };
    },
  );

  app.post(
    '/',
    async(request,reply) => {
      const createMealsBodySchema = z.object({
        name: z.string(),
      });

      const { name } = createMealsBodySchema.parse(request.body,);

      let sessionId = request.cookies.sessionId;

      if (!sessionId) {
        sessionId = randomUUID();
  
        reply.setCookie('sessionId', sessionId, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        });
      }

      await knex('users').insert({
        id: randomUUID(),
        name,
        session_id: sessionId,
      });

      return reply.status(201).send();
    }    
  );

}
