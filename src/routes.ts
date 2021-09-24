import { Express, Request, Response } from 'express';

import {
  createEventHandler,
  deletePostHandler,
  getEventHandler,
  updatePostHandler,
} from './controller/event.controller';
import {
  createUserSessionHandler,
  getUserSessionsHandler,
  invalidateUserSessionHandler,
} from './controller/session.controller';
import createUserHandler from './controller/user.controller';
import { requiresUser, validateRequest } from './middlewares';
import {
  createEventSchema,
  deleteEventSchema,
  updateEventSchema,
} from './schema/event.schema';
import {
  createUserSchema,
  createUserSessionSchema,
} from './schema/user.schema';

export default function (app: Express) {
  app.get('/healthcheck', (req: Request, res: Response) => res.sendStatus(200));
  /* Users */
  app.post('/api/users', validateRequest(createUserSchema), createUserHandler);
  /* Sessions */
  app.post(
    '/api/sessions',
    validateRequest(createUserSessionSchema),
    createUserSessionHandler,
  );
  app.delete('/api/sessions', requiresUser, invalidateUserSessionHandler);
  app.get('/api/sessions', requiresUser, getUserSessionsHandler);
  /* Events */
  app.post(
    '/api/events',
    [requiresUser, validateRequest(createEventSchema)],
    createEventHandler,
  );
  app.get('/api/posts/:eventId', getEventHandler);
  app.put(
    '/api/posts/:postId',
    [requiresUser, validateRequest(updateEventSchema)],
    updatePostHandler,
  );
  app.delete(
    '/api/posts/:postId',
    [requiresUser, validateRequest(deleteEventSchema)],
    deletePostHandler,
  );
}
