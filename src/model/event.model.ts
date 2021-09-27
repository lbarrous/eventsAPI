import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

import { UserDocument } from './user.model';

export interface EventDocument extends mongoose.Document {
  eventId: string;
  creator: UserDocument['_id'];
  headline: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  startDate: Date;
  subscriptors: [UserDocument['_id']];
}

const EventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      default: () => nanoid(10),
    },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    headline: { type: String },
    description: { type: String },
    location: { type: String },
    status: { type: String, default: 'PRIVATE' },
    startDate: { type: Date, default: new Date() },
    subscriptors: [
      {
        type: String,
        ref: 'User',
      },
    ],
  },
  { timestamps: true },
);

const Event = mongoose.model<EventDocument>('Event', EventSchema);

export default Event;
