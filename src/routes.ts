import { Express, Request, Response } from 'express';

import {
  createEventHandler,
  deletePostHandler,
  getEventHandler,
  getEventsHandler,
  subscribeEventHandler,
  updatePostHandler,
} from './controller/event.controller';
import {
  createUserSessionHandler,
  getUserSessionsHandler,
  invalidateUserSessionHandler,
} from './controller/session.controller';
import {
  createUserHandler,
  getUserHandler,
  getUserSubscriptionsHandler,
} from './controller/user.controller';
import { requiresUser, validateRequest } from './middlewares';
import {
  createEventSchema,
  deleteEventSchema,
  subscribeToEventSchema,
  updateEventSchema,
} from './schema/event.schema';
import {
  createUserSchema,
  createUserSessionSchema,
} from './schema/user.schema';

export default function (app: Express) {
  app.get('/healthcheck', (req: Request, res: Response) => res.sendStatus(200));
  /* Users */
  app.get(
    '/api/users/subscriptions',
    requiresUser,
    getUserSubscriptionsHandler,
  );
  app.get('/api/users/:userId', requiresUser, getUserHandler);
  /* Auth */
  app.post(
    '/api/auth/signup',
    validateRequest(createUserSchema),
    createUserHandler,
  );
  app.post(
    '/api/auth/signin',
    validateRequest(createUserSessionSchema),
    createUserSessionHandler,
  );
  app.delete('/api/logout', requiresUser, invalidateUserSessionHandler);
  /* Sessions */
  app.get('/api/sessions', requiresUser, getUserSessionsHandler);
  /* Events */
  app.get('/api/events', getEventsHandler);
  app.post(
    '/api/events',
    [requiresUser, validateRequest(createEventSchema)],
    createEventHandler,
  );
  app.get('/api/events/:eventId', getEventHandler);
  app.put(
    '/api/events/:eventId',
    [requiresUser, validateRequest(updateEventSchema)],
    updatePostHandler,
  );
  app.delete(
    '/api/events/:eventId',
    [requiresUser, validateRequest(deleteEventSchema)],
    deletePostHandler,
  );
  app.post(
    '/api/events/subscribe/:eventId',
    [requiresUser, validateRequest(subscribeToEventSchema)],
    subscribeEventHandler,
  );
}
