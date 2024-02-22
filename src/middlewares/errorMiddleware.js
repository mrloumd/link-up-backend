const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  //respond with json that pass a message
  res.json({
    message: err.message,
    // stack trace for additional information in development
    // null in production
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { errorHandler };
