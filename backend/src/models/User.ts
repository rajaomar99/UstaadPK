// backend/src/models/User.ts
import { Schema, model } from 'mongoose';

export interface IUser {
  email: string;
  name: string;
  password: string;
  role: 'student' | 'tutor';
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpiry?: Date;
  passwordResetToken?: string;
  passwordResetExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  email:                    { type: String, required: true, unique: true, lowercase: true, trim: true },
  name:                     { type: String, required: true, trim: true },
  password:                 { type: String, required: true },          // never returned in API responses
  role:                     { type: String, enum: ['student', 'tutor'], required: true },
  isEmailVerified:          { type: Boolean, default: false },

  emailVerificationToken:   { type: String, default: null, select: false },
  emailVerificationExpiry:  { type: Date,   default: null, select: false },
  passwordResetToken:       { type: String, default: null, select: false },
  passwordResetExpiry:      { type: Date,   default: null, select: false },
}, { timestamps: true });

UserSchema.set('toJSON', {
  transform: (doc: any, ret: Record<string, any>) => {
    delete ret.password;
    delete ret.emailVerificationToken;
    delete ret.passwordResetToken;
    return ret;
  }
});

export const User = model<IUser>('User', UserSchema);
