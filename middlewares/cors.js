const cors = require('cors');

function parseAllowedOrigins() {
  const raw = process.env.CORS_ORIGINS || '';
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

const allowedOrigins = parseAllowedOrigins();
const isProduction = process.env.NODE_ENV === 'production';

module.exports = cors({
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    if (!isProduction && allowedOrigins.length === 0) {
      return callback(null, true);
    }

    return callback(new Error('Origem não permitida pelo CORS.'), false);
  },
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600,
});
