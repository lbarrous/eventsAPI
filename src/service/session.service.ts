import { get } from 'lodash';
import { FilterQuery, LeanDocument, UpdateQuery } from 'mongoose';

import Session, { SessionDocument } from '../model/session.model';
import { UserDocument } from '../model/user.model';
import { decode, sign } from '../utils/jwt.utils';
import { findUser } from './user.service';

export const createSession = async (userId: string, userAgent: string) => {
  const session = await Session.create({ user: userId, userAgent });

  return session.toJSON();
};

export const createAccessToken = async ({
  user,
  session,
}: {
  user: // Allows a user object that has had the password omitted
  | Omit<UserDocument, 'password'>
    // Allows a user object that has been found with .lean()
    | LeanDocument<Omit<UserDocument, 'password'>>;
  session: // Allows a session object that has had the password omitted
  | Omit<SessionDocument, 'password'>
    // Allows a session object that has been found with .lean()
    | LeanDocument<Omit<SessionDocument, 'password'>>;
}) => {
  // Build and return the new access token
  const accessToken = sign(
    { ...user, session: session._id },
    { expiresIn: process.env.ACCESS_TOKEN_TTL as string },
  );

  return accessToken;
};

export const reIssueAccessToken = async ({
  refreshToken,
}: {
  refreshToken: string;
}) => {
  // Decode the refresh token
  const { decoded } = decode(refreshToken);

  if (!decoded || !get(decoded, '_id')) return false;

  // Get the session
  const session = await Session.findById(get(decoded, '_id'));

  // Make sure the session is still valid
  if (!session || !session?.valid) return false;

  const user = await findUser({ _id: session.user });

  if (!user) return false;

  const accessToken = createAccessToken({ user, session });

  return accessToken;
};

export const updateSession = async (
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) => Session.updateOne(query, update);

export const findSessions = async (query: FilterQuery<SessionDocument>) =>
  Session.find(query).lean();
