import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

import { UserDocument } from './user.model';

export interface EventDocument extends mongoose.Document {
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
    headline: { type: String, default: true },
    description: { type: String, default: true },
    startDate: { type: Date, default: true },
    subscriptors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true },
);

const Event = mongoose.model<EventDocument>('Event', EventSchema);

export default Event;
