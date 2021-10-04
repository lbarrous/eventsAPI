// @ts-nocheck

import {
  maximumNumberOfSubscriptions,
  subscriptionAlreadyMade,
} from '../event.validators';

describe('Event validators', () => {
  it('should reject when subscriptions are more than 3', async () => {
    expect(
      maximumNumberOfSubscriptions.reject({
        subscriptions: ['1', '2', '3', '4'],
      })
    ).toBe(true);
  });
  it('should reject when subscription is already done', async () => {
    expect(
      subscriptionAlreadyMade.reject(
        { _id: 'user', subscriptions: ['event'] },
        { _id: 'event', subscriptors: ['user'] }
      )
    ).toBe(true);
  });
});
