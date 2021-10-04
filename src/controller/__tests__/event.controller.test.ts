// @ts-nocheck
import request from 'supertest';

import app from '../../app';

const db = require('../../../jest/db');

// Setup connection to the database
beforeAll(async () => await db.connect());
afterAll(async () => await db.close());

let token;
let eventId;

describe('Event controller', () => {
  beforeAll(async () => {
    const signup = await request(app).post('/api/auth/signup').send({
      email: 'hello@world.com',
      password: '123456',
      passwordConfirmation: '123456',
      name: 'hello',
    });

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
        status: 'PUBLIC',
      });

    eventId = event.body.eventId;
  });
  test('get /api/events', async () => {
    const events = await request(app).get('/api/events');
    expect(events.statusCode).toBe(200);
    expect(events.type).toBe('application/json');
  });
  test('post /api/events with JWT token', async () => {
    const events = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'description',
        headline: 'headline',
        location: 'location',
        startDate: '2022-09-29 01:30:00',
        status: 'PUBLIC',
      });
    expect(events.statusCode).toBe(200);
    expect(events.type).toBe('application/json');
  });
  test('post /api/events without JWT token', async () => {
    const event = await request(app).post('/api/events').send({
      description: 'description',
      headline: 'headline',
      location: 'location',
      startDate: '2022-09-29 01:30:00',
      status: 'PUBLIC',
    });
    expect(event.statusCode).toBe(403);
  });
  test('get /api/events/:eventId', async () => {
    const event = await request(app).get('/api/events/' + eventId);
    expect(event.statusCode).toBe(200);
    expect(event.type).toBe('application/json');
  });
  test('put /api/events/:eventId', async () => {
    const event = await request(app)
      .put('/api/events/' + eventId)
      .set('Authorization', `Bearer ${token}`)
      .send({
        description: 'description',
        headline: 'headline',
        location: 'location',
        startDate: '2022-09-29 01:30:00',
        status: 'PRIVATE',
      });

    expect(event.statusCode).toBe(200);
    expect(event.type).toBe('application/json');
  });
  test('post /api/events/subscribe/:eventId', async () => {
    const event = await request(app)
      .post('/api/events/subscribe/' + eventId)
      .set('Authorization', `Bearer ${token}`);

    expect(event.statusCode).toBe(200);
  });
  test('delete /api/events/:eventId', async () => {
    const event = await request(app)
      .delete('/api/events/' + eventId)
      .set('Authorization', `Bearer ${token}`);

    expect(event.statusCode).toBe(200);
    expect(event.type).toBe('text/plain');
  });
});
