// path: ./config/server.js
module.exports = ({ env }) => ({
  host: '0.0.0.0',
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', 'https://learning-management-system-production-2179.up.railway.app'),
  proxy: true, // 👈 THIS must be true (not env variable)
  app: {
    keys: env.array('APP_KEYS'),
  },
});
