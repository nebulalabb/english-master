import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    avatarUrl: z.string().url().optional(),
    learningGoals: z.string().optional(),
    level: z.string().optional(),
  }),
});
