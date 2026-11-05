import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '../config/redis';
import { logger } from '../utils/logger';
import { config } from '../config';

function createStore(prefix: string) {
  return new RedisStore({
    // @ts-expect-error - sendCommand types
    sendCommand: (...args: string[]) => redisClient.call(...args),
    prefix,
  });
}

/**
 * Tier 1: Global API limiter
 * Applied to all /api/* routes. Uses Redis for distributed counting.
 * Prevents general abuse and DDoS.
 */
export const globalRateLimiter = rateLimit({
  windowMs: config.rateLimit.global.windowMs,
  max: config.rateLimit.global.max,
  standardHeaders: true,
  legacyHeaders: false,
  store: createStore('rl:global:'),
  handler: (req, res) => {
    logger.warn('Global rate limit exceeded', { ip: req.ip, path: req.path, method: req.method });
    res.status(429).json({
      error: 'Too many requests, please try again later',
      retryAfter: Math.ceil(config.rateLimit.global.windowMs / 1000),
    });
  },
});

/**
 * Tier 2: Auth limiter - strict limits for authentication endpoints
 * Prevents brute force attacks on login/register
 */
export const authRateLimiter = rateLimit({
  windowMs: config.rateLimit.auth.windowMs,
  max: config.rateLimit.auth.max,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  store: createStore('rl:auth:'),
  handler: (req, res) => {
    logger.warn('Auth rate limit exceeded', { ip: req.ip, path: req.path });
    res.status(429).json({
      error: 'Too many authentication attempts from this IP, please try again after 15 minutes',
      retryAfter: Math.ceil(config.rateLimit.auth.windowMs / 1000),
    });
  },
});

/**
 * Tier 3: Password reset limiter - very strict
 * Prevents abuse of password reset functionality
 */
export const passwordResetRateLimiter = rateLimit({
  windowMs: config.rateLimit.passwordReset.windowMs,
  max: config.rateLimit.passwordReset.max,
  standardHeaders: true,
  legacyHeaders: false,
  store: createStore('rl:pwd:'),
  handler: (req, res) => {
    logger.warn('Password reset rate limit exceeded', { ip: req.ip });
    res.status(429).json({
      error: 'Too many password reset attempts, please try again after 1 hour',
      retryAfter: Math.ceil(config.rateLimit.passwordReset.windowMs / 1000),
    });
  },
});

/**
 * Tier 4: Authenticated user limiter
 * Applied to API routes after authentication.
 * Uses userId as key for precise per-user limiting.
 * Critical for CGNAT environments where millions share few IPs.
 */
export const authenticatedRateLimiter = rateLimit({
  windowMs: config.rateLimit.authenticated.windowMs,
  max: config.rateLimit.authenticated.max,
  standardHeaders: true,
  legacyHeaders: false,
  store: createStore('rl:user:'),
  keyGenerator: (req) => {
    return (req as any).user?.id || req.ip || 'unknown';
  },
  handler: (req, res) => {
    const userId = (req as any).user?.id || 'unknown';
    logger.warn('Authenticated rate limit exceeded', { userId, ip: req.ip, path: req.path });
    res.status(429).json({
      error: 'Too many requests, please try again later',
      retryAfter: Math.ceil(config.rateLimit.authenticated.windowMs / 1000),
    });
  },
});

/**
 * Tier 5: Calculator limiter - daily limit per user
 * Enforced at the business logic level.
 */
export const calculatorRateLimiter = rateLimit({
  windowMs: config.rateLimit.calculator.windowMs,
  max: config.rateLimit.calculator.max,
  standardHeaders: true,
  legacyHeaders: false,
  store: createStore('rl:calc:'),
  keyGenerator: (req) => {
    return (req as any).user?.id || req.ip || 'unknown';
  },
  handler: (req, res) => {
    logger.warn('Calculator rate limit exceeded', { ip: req.ip, user: (req as any).user?.id });
    res.status(429).json({
      error: 'Daily calculation limit reached. Upgrade to Planner for unlimited calculations.',
      retryAfter: Math.ceil(config.rateLimit.calculator.windowMs / 1000),
    });
  },
});
