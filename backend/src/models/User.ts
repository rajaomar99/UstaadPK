// backend/src/models/User.ts
import { Schema, Document, model } from 'mongoose';

export interface IUserDocument extends Document {
  email: string;
  name: string;
  password: string;           // bcrypt hashed
  phone?: string;
  role: 'student' | 'tutor' | 'pending';
  city?: string;
  profilePhotoUrl?: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpiry?: Date;
  passwordResetToken?: string;
  passwordResetExpiry?: Date;
  isOnboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>({
  email:                    { type: String, required: true, unique: true, lowercase: true, trim: true },
  name:                     { type: String, required: true, trim: true },
  password:                 { type: String, required: true },          // never returned in API responses
  phone:                    { type: String, default: null },
  role:                     { type: String, enum: ['student', 'tutor', 'pending'], default: 'pending' },
  city:                     { type: String, default: null },
  profilePhotoUrl:          { type: String, default: null },
  isEmailVerified:          { type: Boolean, default: false },
  isOnboarded:              { type: Boolean, default: false },
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

export const User = model<IUserDocument>('User', UserSchema);
