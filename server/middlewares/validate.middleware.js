export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    // Only overwrite body and params safely
    req.body = parsed.body ?? req.body;
    req.params = parsed.params ?? req.params;

    // DO NOT reassign req.query
    // Instead merge safely:
    Object.assign(req.query, parsed.query ?? {});

    next();
  } catch (err) {
    console.log("VALIDATION ERROR RAW:", err);

    if (err.errors) {
      return res.status(400).json({
        success: false,
        message: err.errors[0]?.message || "Validation failed"
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid request data"
    });
  }
};