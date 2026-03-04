import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

// START SESSION
export const startSessionSchema = z.object({
  body: z.object({
    topic: z.string().trim().min(2).max(150)
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

// VIDEO EVENT
export const videoEventSchema = z.object({
  body: z.object({
    sessionId: objectId,
    videoId: z.string().min(5).max(100),
    title: z.string().min(1).max(900),
    description: z.string().max(5000).optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

// HEARTBEAT
export const heartbeatSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    sessionId: objectId
  }),
  query: z.object({}).optional()
});

// COMPLETE SESSION
export const completeSessionSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    sessionId: objectId
  }),
  query: z.object({}).optional()
});

// RESET SESSION
export const resetSessionSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    sessionId: objectId
  }),
  query: z.object({}).optional()
});

// SESSION EVENT
export const sessionEventSchema = z.object({
  body: z.object({
    eventId: z.string().min(10).max(100),
    type: z.enum([
      "VIDEO_DETECTED",
      "TAB_HIDDEN_START",
      "TAB_HIDDEN_END",
      "PAUSE_START",
      "PAUSE_END",
      "HEARTBEAT",
      "SHORTS_DETECTED"
    ]),
    clientTimestamp: z.string().datetime().optional()
  }),
  params: z.object({
    sessionId: objectId
  }),
  query: z.object({}).optional()
});