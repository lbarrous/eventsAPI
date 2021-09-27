import bcryptjs from 'bcryptjs';
import mongoose from 'mongoose';

import { EventDocument } from './event.model';

const SALT_WORK_FACTOR = 10;

export interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  subscriptions: [EventDocument['_id']];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    subscriptions: [
      {
        type: String,
        ref: 'Event',
      },
    ],
  },
  { timestamps: true },
);

// @ts-ignore
UserSchema.pre('save', async function (next: mongoose.HookNextFunction) {
  const user = this as UserDocument;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // Random additional data
  const salt = await bcryptjs.genSalt(SALT_WORK_FACTOR);

  const hash = await bcryptjs.hashSync(user.password, salt);

  // Replace the password with the hash
  user.password = hash;

  return next();
});

// Used for logging in
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this as UserDocument;

  return bcryptjs.compare(candidatePassword, user.password).catch(() => false);
};

const User = mongoose.model<UserDocument>('User', UserSchema);

export default User;
