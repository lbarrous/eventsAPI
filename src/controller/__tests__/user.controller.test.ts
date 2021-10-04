// @ts-nocheck
import request from 'supertest';

import app from '../../app';

const db = require('../../../jest/db');

// Setup connection to the database
beforeAll(async () => await db.connect());
afterAll(async () => await db.close());

let token;
let eventId;
let userId;

describe('User controller', () => {
  beforeAll(async () => {
    const signup = await request(app).post('/api/auth/signup').send({
      email: 'hello@world.com',
      password: '123456',
      passwordConfirmation: '123456',
      name: 'hello',
    });

    userId = signup.body._id;

    const signin = await request(app).post('/api/auth/signin').send({
      email: 'hello@world.com',
      password: '123456',
    });

    token = signin.body.accessToken;

    const event = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'description',
        headline: 'headline',
        location: 'location',
        startDate: '2022-09-29 01:30:00',
        status: 'PRIVATE',
      });

    eventId = event.body.eventId;
  });
  test('get /api/users/:userId', async () => {
    const events = await request(app)
      .get('/api/users/' + userId)
      .set('Authorization', `Bearer ${token}`);
    expect(events.statusCode).toBe(200);
    expect(events.type).toBe('application/json');
  });

  test('get /api/users/:userId with invalid user', async () => {
    const events = await request(app)
      .get('/api/users/' + 'invalidUser')
      .set('Authorization', `Bearer ${token}`);
    expect(events.statusCode).toBe(403);
  });

  test('get /api/users/subscriptions', async () => {
    const events = await request(app)
      .get('/api/users/subscriptions')
      .set('Authorization', `Bearer ${token}`);
    expect(events.statusCode).toBe(200);
    expect(events.type).toBe('application/json');
  });
});
