const buckets = new Map();

function buildKey(req, keyPrefix, keyGenerator) {
  const derived = keyGenerator(req);
  return `${keyPrefix}:${derived || 'anonymous'}`;
}

module.exports = function createRateLimit({
  windowMs = 15 * 60 * 1000,
  max = 100,
  keyPrefix = 'global',
  keyGenerator = (req) => req.ip,
  message = 'Too many requests. Please try again later.',
}) {
  return (req, res, next) => {
    const now = Date.now();
    const key = buildKey(req, keyPrefix, keyGenerator);
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      res.setHeader('X-RateLimit-Limit', max);
      res.setHeader('X-RateLimit-Remaining', Math.max(max - 1, 0));
      return next();
    }

    bucket.count += 1;
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(max - bucket.count, 0));

    if (bucket.count > max) {
      res.setHeader('Retry-After', Math.ceil((bucket.resetAt - now) / 1000));
      return res.status(429).send(message);
    }

    return next();
  };
};
