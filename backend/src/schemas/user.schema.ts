import { z } from 'zod';

// ─── Update Current User (PATCH /api/v1/users/me) ────────────────────────────

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
