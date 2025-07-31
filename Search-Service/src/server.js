require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const redis = require('ioredis');
const mongoose = require('mongoose');
const logger = require('./utils/logger.js');
const errorHandler = require('./middleware/errorHandler.js');
const { ConnectRabbitMQ,consumeEvent } = require('./utils/rabbitMQ.js')
const app = express();
const port = process.env.PORT || 3005;



connect(process.env.MONGODB_URI)
  .then(() => logger.info('Connected to database'))
  .catch(e => logger.error('Database connection error', e));

// Redis
const redisclient = new Redis(process.env.REDIS_URL);

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url, body: req.body }, 'Incoming request');
  next();
});

// homework :  rate limiter ----


app.use()

