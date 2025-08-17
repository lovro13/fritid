const logger = require('../logger');

const requestLogger = (req, res, next) => {
  // Log the request
  logger.info({
    message: 'Incoming Request',
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    body: req.body,
    params: req.params,
    query: req.query
  });
  next();
};

module.exports = requestLogger;
