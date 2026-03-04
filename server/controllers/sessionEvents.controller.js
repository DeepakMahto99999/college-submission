import Session from "../models/Session.model.js";
import SessionEvent from "../models/SessionEvent.model.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import AppError from "../utils/AppError.js";



// Recovery Expiry Enforcer
function enforceRecoveryIfExpired(session) {
    if (
        session.recoveryActive &&
        session.recoveryWindowEndsAt &&
        Date.now() > session.recoveryWindowEndsAt.getTime()
    ) {
        session.status = "INVALID";
        session.invalidReason = "TOPIC_MISMATCH";
        session.recoveryActive = false;
        session.recoveryWindowEndsAt = null;
    }
}



// Handle Session Event
export const handleSessionEvent = asyncHandler(async (req, res) => {

    const userId = req.user.userId;
    const { sessionId } = req.params;
    const { eventId, type, clientTimestamp } = req.body;

    const session = await Session.findOne({ _id: sessionId, userId });

    if (!session) {
        throw new AppError("Session not found", 400);
    }

    // Enforce recovery expiry FIRST
    enforceRecoveryIfExpired(session);

    if (session.status === "INVALID") {
        await session.save();
        return res.json({
            success: true,
            status: session.status,
            invalidReason: session.invalidReason
        });
    }

    // Only allow event processing when RUNNING
    if (session.status !== "RUNNING") {
        return res.json({ success: true });
    }

    const now = new Date();

    // Idempotent Event Insert (DB-level protection)
    try {
        await SessionEvent.create({
            sessionId,
            userId,
            eventId,
            type,
            clientTimestamp, // stored but never trusted
            serverTimestamp: now
        });
    } catch (err) {
        // Duplicate eventId (unique index)
        if (err.code === 11000) {
            return res.json({ success: true });
        }
        throw err;
    }

    // Event State Handling
    switch (type) {

        case "SHORTS_DETECTED":
            session.status = "INVALID";
            session.invalidReason = "SHORTS_NOT_ALLOWED";
            break;

        case "TAB_HIDDEN_START":
            session.lastHiddenStart = now;
            break;

        case "TAB_HIDDEN_END":
            handleTabHiddenEnd(session, now);
            break;

        case "PAUSE_START":
            session.lastPauseStart = now;
            break;

        case "PAUSE_END":
            handlePauseEnd(session, now);
            break;

        default:
            break;
    }

    await session.save();

    res.json({
        success: true,
        status: session.status,
        invalidReason: session.invalidReason
    });
});


// Hidden Tab End Handler
function handleTabHiddenEnd(session, now) {

    if (!session.lastHiddenStart) return;

    const hiddenSeconds = Math.floor(
        (now.getTime() - session.lastHiddenStart.getTime()) / 1000
    );

    session.totalHiddenSeconds += hiddenSeconds;
    session.hiddenEventCount += 1;
    session.lastHiddenStart = null;

    const maxAllowed = session.focusLength * 60 * 0.2;

    if (session.totalHiddenSeconds > maxAllowed) {
        session.status = "INVALID";
        session.invalidReason = "EXCESSIVE_TAB_AWAY";
    }
}


// Pause End Handler
function handlePauseEnd(session, now) {

    if (!session.lastPauseStart) return;

    const pauseSeconds = Math.floor(
        (now.getTime() - session.lastPauseStart.getTime()) / 1000
    );

    session.totalPauseSeconds += pauseSeconds;
    session.pauseEventCount += 1;
    session.lastPauseStart = null;

    const maxAllowed = session.focusLength * 60 * 0.2;

    if (session.totalPauseSeconds > maxAllowed) {
        session.status = "INVALID";
        session.invalidReason = "PAUSE_ABUSE";
    }
}