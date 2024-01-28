import { afterAll, beforeAll, describe, it } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';

describe('userRoutes', () => {
  beforeAll(async () => {
    await app.ready();
  });
    
  afterAll(async () => {
    await app.close();
  });

  it('Should be possible create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'Hugo Linhares',
      })
      .expect(201);
  });
});