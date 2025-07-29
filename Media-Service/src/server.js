require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require("./middleware/errrorHandler.js");
const mediaroutes = require('./routes/mediaroutes.js');
const logger = require('./utils/logger.js');
const { uploadmedia } = require('./controllers/mediaControllers.js');

const app = express();
const PORT = process.env.PORT || 3003;

mongoose.connect(process.env.MONGODB_URI)
.then(() => logger.info('DataBase connected'))
.catch((e) => logger.error('DataBase connection error',e))

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use( (req, _res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body , ${req.body}`);
  next();
});


// **** -Implement ip based rate limiter for sensitive endpoints. ****//

app.use('/api/media',mediaroutes);

app.use(errorHandler);



app.listen(PORT, () => {
  logger.info(` Media Server  is running on port ${PORT}`);
});

// Unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason);
});
