const notFound = (req, res, next) => {
  const err = new Error('Route not found');
  err.status = 404;
  err.statusCode = 404;
  err.isOperational = true;
  next(err);
};

module.exports = notFound;