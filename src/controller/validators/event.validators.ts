import { EventDocument } from '../../model/event.model';
import { UserDocument } from '../../model/user.model';

export const maximumNumberOfSubscriptions = {
  reject: (user: UserDocument) => user.subscriptions.length > 3,
  message: 'Reached maximum number of subscriptions allowed',
  code: 403,
};

export const subscriptionAlreadyMade = {
  reject: (user: UserDocument, event: EventDocument) =>
    user.subscriptions.includes(event._id) || event.subscriptors.includes(user._id),
  message: 'This subscription is already made',
  code: 403,
};
