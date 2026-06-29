// backend/src/models/ContactEvent.ts
import { Schema, Types, model } from 'mongoose';

// ─── Interface ────────────────────────────────────────────────────────────────

export interface IContactEvent {
  tutorId: Types.ObjectId;                    // ref: Tutor
  source: 'profile_page' | 'search_results'; // where the WhatsApp click happened
  createdAt: Date;                            // auto-set by Mongoose; TTL index uses this
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const ContactEventSchema = new Schema<IContactEvent>({
  tutorId: { type: Schema.Types.ObjectId, ref: 'Tutor', required: true },
  source:  { type: String, enum: ['profile_page', 'search_results'], required: true },
}, {
  timestamps: { createdAt: true, updatedAt: false }, // only need createdAt
});

// ─── TTL Index ────────────────────────────────────────────────────────────────
// MongoDB automatically deletes documents 90 days after createdAt.
// No manual cleanup job needed — the collection stays lean forever.

ContactEventSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

// Index for querying "how many clicks did tutor X get between date A and date B?"
ContactEventSchema.index({ tutorId: 1, createdAt: -1 });

// ─── Export ───────────────────────────────────────────────────────────────────

export const ContactEvent = model<IContactEvent>('ContactEvent', ContactEventSchema);
