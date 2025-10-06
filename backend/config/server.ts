// path: ./config/server.js

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('URL'), // Make sure this is set
  proxy: true,     // <-- ADD THIS LINE
  app: {
    keys: env.array('APP_KEYS'),
  },
});