import { z } from "zod";

// Mongo ObjectId validator
const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

// REGISTER
export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(75),
    email: z.string().trim().email().max(100),
    password: z.string().min(8).max(100)
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

// LOGIN
export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email().max(100),
    password: z.string().min(8).max(100)
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
}); 