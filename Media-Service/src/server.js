require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require("./middleware/errrorHandler.js");
const mediaroutes = require('./routes/mediaroutes.js');
const logger = require('./utils/logger.js');
const { uploadmedia } = require('./controllers/mediaControllers.js');
const upload = require('./utils/multer.js');
const { ConnectRabbitMQ, consumeEvent } = require('./utils/rabbitMQ.js');
const { handlepostdelete } = require('./eventHandlers.js/Media-Handlers.js');


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

app.use('/api/media',mediaroutes,uploadmedia);

app.use(errorHandler);

async function StartServer(){
  try {
    await ConnectRabbitMQ();

    //consume events from post event
    await consumeEvent('post.deleted',handlepostdelete);

    app.listen(PORT, () => {
    logger.info(` Media Server  is running on port ${PORT}`);
});
  } catch (e) {
    logger.error('error starting the server',e);
    process.exit(1);
  }
}

StartServer()
// Unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason);
});
