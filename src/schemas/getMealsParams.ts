import { z } from 'zod';

export const getMealsParamsSchema = z.object({
  id: z.string().uuid(),
});