// @ts-nocheck
import deserializeUser from '../deserializeUser';
import { decode } from '../../utils/jwt.utils';
import { reIssueAccessToken } from '../../service/session.service';

describe('Deserialize user middleware', () => {
  beforeAll(() => jest.resetAllMocks());
  const mockReq = (params) => {
    const req = {
      ...params,
    };

    return req;
  };

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.setHeader = jest.fn();
    return res;
  };

  it('should not set user on request if headers do not have bearer token', async () => {
    const mockedNext = jest.fn();
    const mockedReq = mockReq();
    const mockedRes = mockRes();

    const result = await deserializeUser(mockedReq, mockedRes, mockedNext);
    expect(mockedNext.mock.calls.length).toBe(1);
    expect(mockedReq.user).not.toBeDefined();
  });

  it('should set user on request if headers have bearer token and user is got from token', async () => {
    decode = jest.fn().mockImplementation(() => {
      return {
        decoded: 'id',
        expired: false,
      };
    });
    const mockedNext = jest.fn();
    const mockedReq = mockReq({
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTUzYTMwZmY3NzRjMTZlMjEwMmQ3ZTciLCJlbWFpbCI6ImhAaC5jb20iLCJuYW1lIjoiQWx2YXJvIiwic3Vic2NyaXB0aW9ucyI6W10sImNyZWF0ZWRBdCI6IjIwMjEtMDktMjhUMjM6MTk6NDMuODE3WiIsInVwZGF0ZWRBdCI6IjIwMjEtMDktMjhUMjM6MTk6NDMuODE3WiIsIl9fdiI6MCwic2Vzc2lvbiI6IjYxNTNhMzE2Zjc3NGMxNmUyMTAyZDdlYSIsImlhdCI6MTYzMjg3MTE5MCwiZXhwIjoxNjMyODcyMDkwfQ.ZeNb8DiMBnDWlTHNfwk_CltsXUiDN_FszUS_vYccgrg',
      },
    });
    const mockedRes = mockRes();

    const result = await deserializeUser(mockedReq, mockedRes, mockedNext);
    expect(mockedNext.mock.calls.length).toBe(1);
    expect(mockedReq.user).toBeDefined();
  });
  it('should set user on request if token is expired but refreshToken is attached', async () => {
    decode = jest
      .fn()
      .mockImplementationOnce(() => {
        return {
          decoded: null,
          expired: true,
        };
      })
      .mockImplementationOnce(() => {
        return {
          decoded: 'id',
          expired: false,
        };
      });
    reIssueAccessToken = jest.fn().mockResolvedValue('newAccessToken');
    const mockedNext = jest.fn();
    const mockedReq = mockReq({
      headers: {
        authorization:
          'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTUzYTMwZmY3NzRjMTZlMjEwMmQ3ZTciLCJlbWFpbCI6ImhAaC5jb20iLCJuYW1lIjoiQWx2YXJvIiwic3Vic2NyaXB0aW9ucyI6W10sImNyZWF0ZWRBdCI6IjIwMjEtMDktMjhUMjM6MTk6NDMuODE3WiIsInVwZGF0ZWRBdCI6IjIwMjEtMDktMjhUMjM6MTk6NDMuODE3WiIsIl9fdiI6MCwic2Vzc2lvbiI6IjYxNTNhMzE2Zjc3NGMxNmUyMTAyZDdlYSIsImlhdCI6MTYzMjg3MTE5MCwiZXhwIjoxNjMyODcyMDkwfQ.ZeNb8DiMBnDWlTHNfwk_CltsXUiDN_FszUS_vYccgrg',
        ['x-refresh']: 'refreshToken',
      },
    });
    const mockedRes = mockRes();

    const result = await deserializeUser(mockedReq, mockedRes, mockedNext);
    expect(mockedNext.mock.calls.length).toBe(1);
    expect(mockedReq.user).toBeDefined();
  });
});
