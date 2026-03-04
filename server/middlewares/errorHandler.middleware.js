import logger from "../utils/logger.js";

export const errorHandler = (err, req, res, next) => {

  const statusCode = err.statusCode || 500;

  logger.error({
    type: "error",
    message: err.message,
    stack: err.stack,
    statusCode,
    method: req.method,
    route: req.originalUrl,
    userId: req.user?.userId || null,
    ip: req.ip,
    body: req.body,
    params: req.params,
    query: req.query
  });

  res.status(statusCode).json({
    success: false,
    message: err.isOperational
      ? err.message
      : "Internal Server Error"
  });
};