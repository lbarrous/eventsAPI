import {
  DocumentDefinition,
  FilterQuery,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

import Event, { EventDocument } from '../model/event.model';

export const createEvent = async (input: DocumentDefinition<EventDocument>) =>
  Event.create(input);

export const findEvent = (
  query: FilterQuery<EventDocument>,
  options: QueryOptions = { lean: true },
) => Event.findOne(query, {}, options);

export const findAndUpdate = (
  query: FilterQuery<EventDocument>,
  update: UpdateQuery<EventDocument>,
  options: QueryOptions,
) => Event.findOneAndUpdate(query, update, options);

export const deleteEvent = (query: FilterQuery<EventDocument>) =>
  Event.deleteOne(query);
