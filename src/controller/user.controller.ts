import { Request, Response } from 'express';
import { omit } from 'lodash';

import log from '../logger';
import { createUser } from '../service/user.service';

const createUserHandler = async (req: Request, res: Response) => {
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

export default createUserHandler;
