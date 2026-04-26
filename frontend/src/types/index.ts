// UstaadPK — Shared TypeScript Interfaces
// Matches Mongoose schemas in the backend (Section 3 & 5 of implementation plan)

// ─── User ────────────────────────────────────────────────────────────────────

export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "student" | "tutor" | "pending";
  city?: string;
  profilePhoto?: string;
  isEmailVerified: boolean;
  isOnboarded: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Tutor Profile ───────────────────────────────────────────────────────────

export interface ISubjectEntry {
  name: string;
  levels: string[];
}

export interface IQualification {
  degree: string;
  institution: string;
  year: number;
}

export interface ITutorProfile {
  _id: string;
  userId: string;
  user?: Pick<IUser, "_id" | "name" | "email">; // populated via $lookup

  // Basic Info
  phone: string;
  city: string;
  areas: string[];
  bio: string;
  profilePhoto?: string;

  // Teaching
  subjects: ISubjectEntry[];
  teachingModes: string[];
  monthlyRateMin: number;
  monthlyRateMax: number;
  trialClassAvailable: boolean;
  languagesOfInstruction: string[];
  onlineAvailable: boolean;

  // Qualifications
  experienceYears: number;
  qualifications: IQualification[];

  // Status
  isActive: boolean;
  isProfileComplete: boolean;

  // Monetization (Phase 1 — Sprint 7)
  isFeatured: boolean;
  featuredExpiry?: string;
  isPremium: boolean;
  premiumExpiry?: string;
  isVerified: boolean;
  verificationStatus: "none" | "pending" | "verified" | "rejected";
  verificationDocUrl?: string;

  // Analytics
  viewCount: number;
  whatsappClickCount: number;
  averageRating: number;
  reviewCount: number;

  createdAt: string;
  updatedAt: string;
}

// ─── Review ──────────────────────────────────────────────────────────────────

export interface IReview {
  _id: string;
  tutorProfileId: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  comment: string;
  subjectTaught: string;
  isHidden: boolean;
  createdAt: string;
}

// ─── Contact Event ───────────────────────────────────────────────────────────

export interface IContactEvent {
  _id: string;
  tutorProfileId: string;
  source: "profile_page" | "search_results";
  createdAt: string;
}

// ─── API Response ────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  code?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
