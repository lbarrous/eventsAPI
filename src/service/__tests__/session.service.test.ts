import Session from '../../model/session.model';
import User from '../../model/user.model';
import * as SessionService from '../session.service';

const mockingoose = require('mockingoose');

const refreshToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjE1YWNhMjJkNzI1NTg4NzhiZmFlZmI2IiwidmFsaWQiOnRydWUsInVzZXJBZ2VudCI6IlBvc3RtYW5SdW50aW1lLzcuMjguNCIsIl9pZCI6IjYxNWFjYTMwZDcyNTU4ODc4YmZhZWZiOSIsImNyZWF0ZWRBdCI6IjIwMjEtMTAtMDRUMDk6MzI6MzIuMzk1WiIsInVwZGF0ZWRBdCI6IjIwMjEtMTAtMDRUMDk6MzI6MzIuMzk1WiIsIl9fdiI6MCwiaWF0IjoxNjMzMzM5OTUyLCJleHAiOjE2NjQ4OTc1NTJ9.p1WEYRmRJGoOWq28iZVD3B0_SiyehhyxivTj66f5dEU';

describe('Sessions auth', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('should resolve with access token for user and session given', async () => {
    const response = await SessionService.createAccessToken({
      user: new User(),
      session: new Session(),
    });
    expect(response).toBeTruthy();
    expect(typeof response).toBe('string');
  });

  it('should resolve with new access token for valid refresh token and current user with session valid', async () => {
    mockingoose(Session).toReturn({}, 'findOne');
    mockingoose(User).toReturn({}, 'findOne');
    const response = await SessionService.reIssueAccessToken({ refreshToken });
    expect(response).toBeTruthy();
    expect(typeof response).toBe('string');
  });

  it('should resolve with false for valid refresh token and current user with session not valid', async () => {
    mockingoose(Session).toReturn(undefined, 'findOne');
    mockingoose(User).toReturn({}, 'findOne');
    const response = await SessionService.reIssueAccessToken({ refreshToken });
    expect(response).toBe(false);
  });

  it('should resolve with false for valid refresh token and not valid user with session valid', async () => {
    mockingoose(Session).toReturn({}, 'findOne');
    mockingoose(User).toReturn(undefined, 'findOne');
    const response = await SessionService.reIssueAccessToken({ refreshToken });
    expect(response).toBe(false);
  });

  it('should resolve with false for invalid refresh token', async () => {
    const response = await SessionService.reIssueAccessToken({
      refreshToken: '',
    });
    expect(response).toBe(false);
  });
});
