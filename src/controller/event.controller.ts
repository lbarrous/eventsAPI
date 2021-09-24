import { Request, Response } from 'express';
import { get } from 'lodash';

import {
  createEvent,
  findAndUpdate,
  findEvent,
  deleteEvent,
} from '../service/event.service';

export const createEventHandler = async (req: Request, res: Response) => {
  const userId = get(req, 'user._id');
  const { body } = req;

  const post = await createEvent({ ...body, user: userId });

  return res.send(post);
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

  const updatedPost = await findAndUpdate({ eventId }, update, { new: true });

  return res.send(updatedPost);
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
