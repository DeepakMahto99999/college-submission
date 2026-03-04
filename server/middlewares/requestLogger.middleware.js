import logger from "../utils/logger.js";

export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info({
      type: "request",
      method: req.method,
      route: req.originalUrl,
      status: res.statusCode,
      durationMs: duration,
      userId: req.user?.userId || null,
      ip: req.ip
    });
  });

  next();
};