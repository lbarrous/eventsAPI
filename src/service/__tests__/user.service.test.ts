import bcryptjs from 'bcryptjs';
import Event from '../../model/event.model';
import User from '../../model/user.model';
import * as UserService from '../user.service';

const mockingoose = require('mockingoose');

describe('Sessions auth', () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  it('validate password if user exists and passwords matches', async () => {
    bcryptjs.compare = jest.fn().mockResolvedValue(true);
    const email = 'a@a.com';
    const password = '123456';
    mockingoose(User).toReturn({ email, password }, 'findOne');
    const passwordResult = await UserService.validatePassword({
      email,
      password,
    });
    expect(passwordResult).toBeTruthy();
  });
  it('does NOT validate password if user exists and passwords do NOT match', async () => {
    bcryptjs.compare = jest.fn().mockResolvedValue(false);
    const email = 'a@a.com';
    const password = '654321';
    mockingoose(User).toReturn({ email, password }, 'findOne');
    const passwordResult = await UserService.validatePassword({
      email,
      password,
    });
    expect(passwordResult).toBe(false);
  });
  it('does NOT validate password if user does NOT exists', async () => {
    mockingoose(User).toReturn(undefined, 'findOne');
    bcryptjs.compare = jest.fn().mockResolvedValue(false);
    const email = 'a@a.com';
    const password = '123456';
    const passwordResult = await UserService.validatePassword({
      email,
      password,
    });
    expect(passwordResult).toBe(false);
  });
});
