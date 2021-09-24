import bcryptjs from 'bcryptjs';
import mongoose from 'mongoose';

export interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next: mongoose.HookNextFunction) {
  const user = this as UserDocument;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // Random additional data
  const saltWorkFactor = (process.env.SALT_WORK_FACTOR as string) || '';
  const salt = await bcryptjs.genSalt(saltWorkFactor);

  const hash = await bcryptjs.hashSync(user.password, salt);

  // Replace the password with the hash
  user.password = hash;

  return next();
});

// Used for logging in
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  const user = this as UserDocument;

  return bcryptjs.compare(candidatePassword, user.password).catch(() => false);
};

const User = mongoose.model<UserDocument>('User', UserSchema);

export default User;
