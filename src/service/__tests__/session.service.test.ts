import Session from '../../model/session.model';
import User from '../../model/user.model';
import * as SessionService from '../session.service';

describe('Sessions auth', () => {
  it('should resolve with access token for new user and session token', async () => {
    const response = await SessionService.createAccessToken({
      user: new User(),
      session: new Session(),
    });
    expect(response).toBeTruthy();
    expect(typeof response).toBe('string');
  });
});
