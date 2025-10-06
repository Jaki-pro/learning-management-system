// path: ./config/server.ts
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),

  url: env('URL', 'https://learning-management-system-production-2179.up.railway.app'),

  proxy: {
    koa: process.env.NODE_ENV === 'production'
  },

  app: {
    keys: env.array('APP_KEYS'),
  },

  settings: {
    cors: {
      origin: ['https://learning-management-system-production-2179.up.railway.app'],
      credentials: true,
    },
  },
});
