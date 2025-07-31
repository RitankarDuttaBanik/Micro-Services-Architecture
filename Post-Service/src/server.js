require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const Redis = require('ioredis');
const redisClient = new Redis();
const helmet = require('helmet');
const cors = require('cors');
const postRoutes = require('./routes/postroutes.js');
const {errorHandler} = require('./middleware/errorHandler.js');
const logger = require('./utils/logger.js');

const app = express();
const PORT = process.env.PORT || 3002;



mongoose.connect(process.env.MONGODB_URI)
.then( () => logger.info('connected to DataBase.'))
.catch((e) => logger.error('unable to connect to DataBase.'));


// middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use( (req, _res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body , ${req.body}`);
  next();
});


// **** -Implement ip based rate limiter for sensitive endpoints. ****// like ->for create post allowrd user 10 post in 1 minute.


//routes

app.use("/api/posts", (req,res,next) => {

    req.redisClient = redisClient;
    next();
}, postRoutes)

app.use(errorHandler);


async function StartServer(){
  try{
      app.listen(PORT, () => {
  logger.info(` Post Server  is running on port ${PORT}`);
});
}catch(e){
    logger.error('Error connecting port for post server.',e);
    process.exit(1);
  }
  
}

StartServer();

// Unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason);
});