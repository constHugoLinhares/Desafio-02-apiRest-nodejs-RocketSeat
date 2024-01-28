import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import request from 'supertest';
import { app } from '../src/app';
import { execSync } from 'child_process';

describe('userRoutes', () => {
  beforeAll(async () => {
    await app.ready();
  });
    
  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    execSync('npm run migrate:latest');
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