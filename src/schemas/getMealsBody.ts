import { z } from 'zod';

export const getMealsBodySchema = z.object({
  description: z.string().optional(),
  inDiet: z.boolean().optional(),
});