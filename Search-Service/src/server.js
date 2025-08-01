require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const redis = require('ioredis');
const mongoose = require('mongoose');
const logger = require('./utils/logger.js');
const {errorHandler} = require('./middleware/errorHandler.js');
const { ConnectRabbitMQ,consumeEvent } = require('./utils/rabbitMQ.js')
const  searchRoutes = require('./routes/mediaroutes.js');
const { handlepostcreated, deletecreatepost } = require('./EventHandlers/eventHandler.js');
const app = express();
const port = process.env.PORT || 3005;



mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.info('Connected to database'))
  .catch(e => logger.error('Database connection error', e));

// Redis
const redisclient = new redis(process.env.REDIS_URL);

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url, body: req.body }, 'Incoming request');
  next();
});

// homework :  rate limiter ----

//redis caching also
app.use('/api/search', searchRoutes);

app.use(errorHandler);

async function StartServer(){
  try{
    await ConnectRabbitMQ();
    
    await consumeEvent('post.created',handlepostcreated);
    await consumeEvent('post.deleted',deletecreatepost);

    app.listen(port, () => {
      logger.info(` Search Server  is running on port ${port}`);
});
     
  }
catch(e){
    logger.error('Error connecting search for search server.',e);
    process.exit(1);
  }
  
}



StartServer();

// Unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason);
});



