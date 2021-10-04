// @ts-nocheck
import validateRequest from '../validateRequest';

describe('Validate request middleware', () => {
  beforeAll(() => jest.resetAllMocks());
  const mockReq = (params) => {
    const req = {
      ...params,
    };

    return req;
  };

  const mockRes = () => {
    const res = {};
    res.status = jest.fn(() => res);
    res.send = jest.fn();
    res.json = jest.fn().mockReturnValue(res);
    res.setHeader = jest.fn();
    return res;
  };

  it('should send status 400 if validation fails', async () => {
    const mockedNext = jest.fn();
    const mockedReq = mockReq();
    const mockedRes = mockRes();

    const schema = {
      validate: jest.fn().mockRejectedValueOnce(new Error()),
    };

    const result = await validateRequest(schema)(
      mockedReq,
      mockedRes,
      mockedNext
    );
    expect(mockedNext.mock.calls.length).toBe(0);
    expect(mockedRes.status).toHaveBeenCalledWith(400);
  });
});
