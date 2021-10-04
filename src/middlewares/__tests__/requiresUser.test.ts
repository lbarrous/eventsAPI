// @ts-nocheck
import requiresUser from '../requiresUser';

describe('Requires user middleware', () => {
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
    res.sendStatus = jest.fn();
    return res;
  };

  it('should send status 403 if user is not present on request', async () => {
    const mockedNext = jest.fn();
    const mockedReq = mockReq();
    const mockedRes = mockRes();

    const result = await requiresUser(mockedReq, mockedRes, mockedNext);
    expect(mockedNext.mock.calls.length).toBe(0);
    expect(mockedRes.sendStatus).toHaveBeenCalledWith(403);
  });
});
