import { z } from 'zod';

// ─── Sub-document Schemas ─────────────────────────────────────────────────────

const subjectEntrySchema = z.object({
  name:   z.string().min(1, 'Subject name is required').trim(),
  levels: z.array(z.string().min(1)).min(1, 'At least one level is required per subject'),
});

const qualificationSchema = z.object({
  degree:      z.string().min(1, 'Degree is required').trim(),
  institution: z.string().min(1, 'Institution is required').trim(),
  year:        z.number().int().min(1970).max(
    new Date().getFullYear(),
    'Graduation year cannot be in the future'
  ),
});

// ─── Create Tutor Profile ─────────────────────────────────────────────────────

export const createTutorSchema = z.object({
  phone:                  z.string().regex(
                            /^03[0-9]{9}$/,
                            'Phone must be a valid Pakistani number (e.g. 03001234567)'
                          ),
  bio:                    z.string()
                            .min(100, 'Bio must be at least 100 characters')
                            .max(600, 'Bio cannot exceed 600 characters')
                            .trim(),
  city:                   z.string().min(1, 'City is required').trim(),
  areas:                  z.array(z.string().min(1)).min(1, 'At least one area is required'),
  subjects:               z.array(subjectEntrySchema).min(1, 'At least one subject is required'),
  teachingModes:          z.array(z.string().min(1)).min(1, 'At least one teaching mode is required'),
  monthlyRateMin:         z.number().min(0, 'Minimum rate cannot be negative'),
  trialClassAvailable:    z.boolean(),
  languagesOfInstruction: z.array(z.string().min(1)).min(1, 'At least one language is required'),
  onlineAvailable:        z.boolean(),
  experienceYears:        z.number().int()
                            .min(0, 'Experience cannot be negative')
                            .max(50, 'Experience years cannot exceed 50'),
  qualifications:         z.array(qualificationSchema).min(1, 'At least one qualification is required'),
});

// ─── Update Tutor Profile ─────────────────────────────────────────────────────
// All fields are optional — tutors can edit any subset of their profile.
// If a field IS provided, all its rules still apply (e.g. bio still needs 100+ chars).

export const updateTutorSchema = createTutorSchema.partial();

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type CreateTutorDto = z.infer<typeof createTutorSchema>;
export type UpdateTutorDto = z.infer<typeof updateTutorSchema>;
