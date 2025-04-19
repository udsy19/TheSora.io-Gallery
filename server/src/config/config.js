require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  B2_APPLICATION_KEY_ID: process.env.B2_APPLICATION_KEY_ID,
  B2_APPLICATION_KEY: process.env.B2_APPLICATION_KEY,
  B2_BUCKET_NAME: process.env.B2_BUCKET_NAME,
  B2_ENDPOINT: process.env.B2_ENDPOINT,
  // Auth0 configuration
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN || 'dev-dzrqcmxpzqhmf4kj.us.auth0.com',
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID || 'kgJRolVfmzoeP7ICusKfqZK1ujZ6gkR8',
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE || ''
};