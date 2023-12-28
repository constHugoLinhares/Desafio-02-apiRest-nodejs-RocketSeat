import { FastifyReply, FastifyRequest } from 'fastify';
import { knex } from '../database';

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = request.cookies.sessionId;
  
  if (!sessionId) {
    return reply.status(401).send({
      error: 'Unauthorized.',
    });
  }
  const users = await knex('users').where('session_id', sessionId).select();
  
  if (users.length === 0) {
    return reply.status(404).send({
      error: 'User doesn\'t exists! // Clean the Cookies!',
    });
  }
}
