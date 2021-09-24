import { Request, Response } from 'express';
import { get } from 'lodash';

import {
  createAccessToken,
  createSession,
  findSessions,
  updateSession,
} from '../service/session.service';
import { validatePassword } from '../service/user.service';
import { sign } from '../utils/jwt.utils';

export const createUserSessionHandler = async (req: Request, res: Response) => {
  // validate the email and password
  const user = await validatePassword(req.body);

  if (!user) {
    return res.status(401).send('Invalid username or password');
  }

  // Create a session
  const session = await createSession(user._id, req.get('user-agent') || '');

  // create access token
  const accessToken = createAccessToken({
    user,
    session,
  });

  // create refresh token
  const refreshTokenTTL = process.env.REFRESH_TOKEN_TTL as string;
  const refreshToken = sign(session, {
    expiresIn: refreshTokenTTL,
  });

  // send refresh & access token back
  return res.send({ accessToken, refreshToken });
};

export const invalidateUserSessionHandler = async (
  req: Request,
  res: Response,
) => {
  const sessionId = get(req, 'user.session');

  await updateSession({ _id: sessionId }, { valid: false });

  return res.sendStatus(200);
};

export async function getUserSessionsHandler(req: Request, res: Response) {
  const userId = get(req, 'user._id');

  const sessions = await findSessions({ user: userId, valid: true });

  return res.send(sessions);
}
