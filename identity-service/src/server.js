import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { connect } from 'mongoose';
import logger from './utils/logger.js';
import helmet from 'helmet';
import cors from 'cors';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';
import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import routes from './routes/identityservices.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3001;

// DB
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

// Global rate limit with rate-limiter-flexible
const rateLimiter = new RateLimiterRedis({
  storeClient: redisclient,
  keyPrefix: 'middleware',
  points: 10, // 10 requests
  duration: 1 // per second
});

app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch {
    logger.warn(`Rate limit (flexible) exceeded for ${req.ip}`);
    res.status(429).send({ message: 'Too many requests', success: false });
  }
});

// Endpoint-specific limiter with express-rate-limit
const endpointLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Rate limit (endpoint) exceeded for ${req.ip}`);
    res.status(429).send({ message: 'Too many requests', success: false });
  },
  store: new RedisStore({
    sendCommand: (...args) => redisclient.call(...args),
  }),
});

app.use('/api/auth/register', endpointLimiter);

// Routes
app.use('/api/auth', routes);

// Error handler (must be after routes)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

// Unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error({
    msg: 'Unhandled Rejection',
    reason: reason instanceof Error ? reason.stack : reason,
    promise
  });
});
