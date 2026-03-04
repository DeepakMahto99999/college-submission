import { z } from "zod";

export const recentSessionsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    limit: z
      .string()
      .transform(val => Number(val))
      .refine(val => !isNaN(val), "Limit must be number")
      .refine(val => val >= 1 && val <= 50, "Limit must be between 1 and 50")
      .optional()
  })
});