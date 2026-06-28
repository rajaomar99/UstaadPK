import { z } from 'zod';

// ─── Update Current User (PATCH /api/v1/users/me) ────────────────────────────
// At least one field must be provided — enforced with .refine()

export const updateUserSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').trim().optional(),
    phone: z
      .string()
      .regex(/^03[0-9]{9}$/, 'Phone must be a valid Pakistani number (e.g. 03001234567)')
      .optional(),
    city: z.string().min(1, 'City cannot be empty').trim().optional(),
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: 'At least one field (name, phone, city) must be provided',
  });

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
