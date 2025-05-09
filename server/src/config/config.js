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
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN || 'dev-g8taohq4go3564mr.us.auth0.com',
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID || 'kgJRolVfmzoeP7ICusKfqZK1ujZ6gkR8',
  AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET || 'Gqd_9tj_hv3NQwZC5NFkXqfzIdBaR51qvWXMdw1Npa1wevOkhj9651zfiIbPHJVa',
  AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE || ''
};