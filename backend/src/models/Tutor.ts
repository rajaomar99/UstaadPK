// backend/src/models/Tutor.ts
import { Schema, Types, model } from 'mongoose';

// ─── Sub-document Interfaces ──────────────────────────────────────────────────

export interface ISubjectEntry {
  name: string;
  levels: string[];
}

export interface IQualification {
  degree: string;
  institution: string;
  year: number;
}

// ─── Main Interface ───────────────────────────────────────────────────────────

export interface ITutor {
  userId: Types.ObjectId;           // ref: User — one profile per tutor

  // Basic Info
  phone: string;                    // WhatsApp contact number (public)
  bio: string;                      // 100–600 chars
  city: string;
  areas: string[];                  // areas served within the city
  profilePhotoUrl?: string;

  // Teaching Details
  subjects: ISubjectEntry[];
  teachingModes: string[];
  monthlyRateMin: number;
  trialClassAvailable: boolean;
  languagesOfInstruction: string[];
  onlineAvailable: boolean;

  // Qualifications & Experience
  experienceYears: number;
  qualifications: IQualification[];

  // Status
  isActive: boolean;
  isProfileComplete: boolean;       // true when all required fields are filled

  // Monetization — Sprint 7 only (fields exist in DB from Day 1, UI not built yet)
  isFeatured: boolean;
  featuredExpiry?: Date;
  isPremium: boolean;
  premiumExpiry?: Date;
  isVerified: boolean;
  verificationStatus: 'none' | 'pending' | 'verified' | 'rejected';
  verificationDocUrl?: string;

  // Analytics
  viewCount: number;
  whatsappClickCount: number;
  averageRating: number;            // 0–5, recalculated on every review create/delete
  reviewCount: number;

  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const TutorSchema = new Schema<ITutor>({
  userId:                 { type: Schema.Types.ObjectId, ref: 'User', required: true },

  // Basic Info
  phone:                  { type: String, required: true, trim: true },
  bio:                    { type: String, required: true, minlength: 100, maxlength: 600, trim: true },
  city:                   { type: String, required: true, trim: true },
  areas:                  { type: [String], default: [] },
  profilePhotoUrl:        { type: String, default: null },

  // Teaching Details
  subjects: [{
    name:   { type: String, required: true },
    levels: { type: [String], required: true },
  }],
  teachingModes:          { type: [String], required: true },
  monthlyRateMin:         { type: Number, required: true, min: 0 },
  trialClassAvailable:    { type: Boolean, default: false },
  languagesOfInstruction: { type: [String], required: true },
  onlineAvailable:        { type: Boolean, default: false },

  // Qualifications & Experience
  experienceYears: { type: Number, required: true, min: 0, max: 50 },
  qualifications: [{
    degree:      { type: String, required: true },
    institution: { type: String, required: true },
    year:        { type: Number, required: true, min: 1970, max: new Date().getFullYear() },
  }],

  // Status
  isActive:          { type: Boolean, default: true },
  isProfileComplete: { type: Boolean, default: false },

  // Monetization (Sprint 7)
  isFeatured:         { type: Boolean, default: false },
  featuredExpiry:     { type: Date, default: null },
  isPremium:          { type: Boolean, default: false },
  premiumExpiry:      { type: Date, default: null },
  isVerified:         { type: Boolean, default: false },
  verificationStatus: { type: String, enum: ['none', 'pending', 'verified', 'rejected'], default: 'none' },
  verificationDocUrl: { type: String, default: null },

  // Analytics
  viewCount:           { type: Number, default: 0 },
  whatsappClickCount:  { type: Number, default: 0 },
  averageRating:       { type: Number, default: 0, min: 0, max: 5 },
  reviewCount:         { type: Number, default: 0 },

}, { timestamps: true });

// ─── Indexes ──────────────────────────────────────────────────────────────────

TutorSchema.index({ userId: 1 }, { unique: true });              // one profile per tutor
TutorSchema.index({ city: 1, isActive: 1, averageRating: -1 }); // city browse + sort
TutorSchema.index({ isActive: 1, createdAt: -1 });               // recently joined
TutorSchema.index({ 'subjects.name': 1 });                       // subject filtering

// ─── Export ───────────────────────────────────────────────────────────────────

export const Tutor = model<ITutor>('Tutor', TutorSchema);
