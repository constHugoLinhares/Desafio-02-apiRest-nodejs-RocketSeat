import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { knex } from '../src/database';
import request from 'supertest';
import { app } from '../src/app';
import { responseUser } from  './Interfaces/interfaces';
import { execSync } from 'child_process';

describe('mealsRoutes', () => {
  beforeAll(async () => {
    await app.ready();
  });
  
  afterAll(async () => {
    await app.close();
  });
  
  beforeEach(() => {
    execSync('npx knex --knexfile ./knexFile.ts  migrate:rollback --all');
    execSync('npm run migrate:latest');
  });

  it('Should be possible create a new meal', async () => {
    const simulatedUser: responseUser[] = await user();

    const sessionId = simulatedUser[0].session_id;
      
    await request(app.server)
      .post('/meals')
      .set('Cookie',  `sessionId=${sessionId}; Max-Age=604800000; Path=/`)
      .send({
        description: 'New meal',
        inDiet: true,
      })
      .expect(201);
  });

  it('Should be possible to list all meals', async () => {
    const simulatedUser: responseUser[] = await user();

    const sessionId = simulatedUser[0].session_id;

    const cookies = `sessionId=${sessionId}; Max-Age=604800000; Path=/`;
    
    for (let i = 0; i <= 1;i++) {
      await request(app.server)
        .post('/meals')
        .set('Cookie',  cookies)
        .send({
          description: `New meal${i}`,
          inDiet: i === 0 ? true : false,
        })
        .expect(201);
    }

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies);

    expect(listMealsResponse.body.meals).toEqual([
      expect.objectContaining({
        description: 'New meal0',
        inDiet: 1,
      }),
      expect.objectContaining({
        description: 'New meal1',
        inDiet: 0,
      }),
    ]);
  });

  it('Should be possible to list a specific meal', async () => {
    const simulatedUser: responseUser[] = await user();

    const sessionId = simulatedUser[0].session_id;

    const cookies = `sessionId=${sessionId}; Max-Age=604800000; Path=/`;
    
    await request(app.server)
      .post('/meals')
      .set('Cookie',  cookies)
      .send({
        description: 'New meal',
        inDiet: true,
      })
      .expect(201);

    const listMealsResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies);

    const mealId = listMealsResponse.body.meals[0].id;

    const specificMealsResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200);

    expect(specificMealsResponse.body.meals).toEqual(
      expect.objectContaining({
        description: 'New meal',
        inDiet: 1,
      }),
    );
  });

  it('Should be possible to show a summary of an user', async () => {
    const simulatedUser: responseUser[] = await user();

    const sessionId = simulatedUser[0].session_id;

    const cookies = `sessionId=${sessionId}; Max-Age=604800000; Path=/`;
    
    const summary = {
      totalMeals: 0,
      totalMealsInDiet: 0,
      totalMealsOutDiet: 0,
      bestSequence: 0,
    };

    await request(app.server)
      .post('/meals')
      .set('Cookie',  cookies)
      .send({
        description: 'New meal',
        inDiet: true,
      })
      .expect(201)
      .then(async () => {
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
      });

    const summaryMealsResponse = await request(app.server)
      .get('/meals/summary')
      .set('Cookie', cookies)
      .expect(200);

    expect(summaryMealsResponse.body.summary).toEqual(
      expect.objectContaining(summary),
    );
  });
});

const user = async () => {
  const newUser = {
    name: 'Hugo Linhares',
  };

  const response = await knex('users')
    .where({ name: newUser.name })
    .select();
  return response;
};