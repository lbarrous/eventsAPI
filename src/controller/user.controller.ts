import { Request, Response } from 'express';
import { get, omit } from 'lodash';

import log from '../logger';
import { findEventsByCriteria } from '../service/event.service';
import { createUser, findUser } from '../service/user.service';

export const createUserHandler = async (req: Request, res: Response) => {
  try {
    const user = await createUser(req.body);
    return res.send(omit(user.toJSON(), 'password'));
  } catch (e) {
    // @ts-ignore
    log.error(e);
    // @ts-ignore
    return res.status(409).send(e.message);
  }
};

export const getUserHandler = async (req: Request, res: Response) => {
  try {
    const userId = get(req, 'user._id');
    const paramUserId = get(req, 'params.userId');

    if (userId !== paramUserId) {
      return res.sendStatus(403);
    }

    const user = await findUser({ _id: userId });
    return res.send(user);
  } catch (e) {
    // @ts-ignore
    log.error(e);
    // @ts-ignore
    return res.status(404).send(e.message);
  }
};

export async function getUserSubscriptionsHandler(req: Request, res: Response) {
  const userId = get(req, 'user._id');

  const subscriptions = await findEventsByCriteria({ subscriptors: userId });

  return res.send(subscriptions);
}
