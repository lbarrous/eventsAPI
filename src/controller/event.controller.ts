import { Request, Response } from 'express';
import { get } from 'lodash';

import {
  createEvent,
  deleteEvent,
  findAndUpdateEvent,
  findEvent,
  findEvents,
  findEventsByUser,
} from '../service/event.service';
import { findAndUpdateUser, findUser } from '../service/user.service';
import {
  maximumNumberOfSubscriptions,
  subscriptionAlreadyMade,
} from './validators/event.validators';

export const createEventHandler = async (req: Request, res: Response) => {
  const userId = get(req, 'user._id');
  const { body } = req;

  const numberOfAlreadyCreatedEvents = (
    await findEventsByUser({ creator: userId })
  ).length;

  if (numberOfAlreadyCreatedEvents > 1) {
    return res.status(403).send('Reached maximum number of events allowed');
  }
  const post = await createEvent({ ...body, creator: userId });
  return res.send(post);
};

export const getEventsHandler = async (req: Request, res: Response) => {
  const events = await findEvents('-_id');

  if (!events) {
    return res.sendStatus(404);
  }

  return res.send(events);
};

export const getEventHandler = async (req: Request, res: Response) => {
  const eventId = get(req, 'params.eventId');
  const event = await findEvent({ eventId });

  if (!event) {
    return res.sendStatus(404);
  }

  return res.send(event);
};

export const updatePostHandler = async (req: Request, res: Response) => {
  const userId = get(req, 'user._id');
  const eventId = get(req, 'params.eventId');
  const update = req.body;

  const event = await findEvent({ eventId });

  if (!event) {
    return res.sendStatus(404);
  }

  if (String(event.creator) !== userId) {
    return res.sendStatus(401);
  }

  const updatedEvent = await findAndUpdateEvent({ eventId }, update, {
    new: true,
  });

  return res.send(updatedEvent);
};

export const deletePostHandler = async (req: Request, res: Response) => {
  const userId = get(req, 'user._id');
  const eventId = get(req, 'params.eventId');

  const event = await findEvent({ eventId });

  if (!event) {
    return res.sendStatus(404);
  }

  if (String(event.creator) !== String(userId)) {
    return res.sendStatus(401);
  }

  await deleteEvent({ eventId });

  return res.sendStatus(200);
};

export const subscribeEventHandler = async (req: Request, res: Response) => {
  const userId = get(req, 'user._id');
  const eventId = get(req, 'params.eventId');

  const event = await findEvent({ eventId });
  if (!event) {
    return res.status(404).send('Event not found');
  }
  const user = await findUser({ _id: userId });
  if (!user) {
    return res.status(404).send('user not found');
  }

  const validators = [subscriptionAlreadyMade, maximumNumberOfSubscriptions];

  validators.forEach((validator) => {
    if (validator.reject(user, event)) {
      return res.status(validator.code).send(validator.message);
    }
  });

  await findAndUpdateEvent(
    { eventId },
    { subscriptors: [...event.subscriptors, user._id] },
    {}
  );

  await findAndUpdateUser(
    { _id: userId },
    { subscriptions: [...user.subscriptions, event._id] },
    {}
  );
  return res.status(200).send('Subscription successfully made');
};
