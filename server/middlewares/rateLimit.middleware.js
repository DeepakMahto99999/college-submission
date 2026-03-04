import rateLimit, { ipKeyGenerator } from "express-rate-limit";


// ======================================================
// COMMON JSON HANDLER (Consistent 429 Response)
// ======================================================
const jsonHandler = (req, res) => {
    return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later."
    });
};


// ======================================================
// 1️⃣ AUTH LIMITER (Strict – Protect Login/Register)
// Prevent brute force attacks
// ======================================================
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 failed attempts per IP
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,

    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message: "Too many authentication attempts. Try again later."
        });
    }
});


// ======================================================
// 2️⃣ GLOBAL API LIMITER (Safety Net)
// Prevent general spam traffic
// ======================================================
export const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 120, // 120 requests per minute per IP
    standardHeaders: true,
    legacyHeaders: false,
    handler: jsonHandler
});


// ======================================================
// 3️⃣ USER ACTION LIMITER (User-Based Preferred)
// If logged in → limit by userId
// If not logged in → fallback to safe IP generator
// ======================================================
export const userActionLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator: (req) => {
        if (req.user?.userId) {
            return `user-${req.user.userId}`;
        }

        // Safe IPv6-compatible IP fallback
        return `ip-${ipKeyGenerator(req)}`;
    },

    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message: "Too many actions. Slow down."
        });
    }
});


// ======================================================
// 4️⃣ AI LIMITER (Critical – Protect AI Costs)
// Very strict limiter for AI/video validation endpoints
// ======================================================
export const aiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,

    keyGenerator: (req) => {
        if (req.user?.userId) {
            return `ai-user-${req.user.userId}`;
        }

        // Safe IPv6-compatible IP fallback
        return `ai-ip-${ipKeyGenerator(req)}`;
    },

    handler: (req, res) => {
        return res.status(429).json({
            success: false,
            message: "Too many AI validation attempts."
        });
    }
});