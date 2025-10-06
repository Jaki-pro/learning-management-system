// path: ./config/server.ts
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),

  url: env('URL', 'https://learning-management-system-production-2179.up.railway.app'),

  proxy: true, // <— Force trust proxy for HTTPS headers

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
