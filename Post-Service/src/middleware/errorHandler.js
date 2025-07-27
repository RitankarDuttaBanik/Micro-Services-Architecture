const logger = require('../utils/logger.js');

const errorHandler = (err, _req, res, _next) => {
  logger.error(err.stack); 

  res.status(err.status || 500).json({
    message: err.message || 'internal server error',
  });
};

module.exports =  {errorHandler};