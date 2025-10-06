// path: ./config/server.js

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('URL'),
  // We use a dedicated boolean ENV variable to enable the proxy.
  proxy: env.bool('PROXY_ENABLED', false),
  app: {
    keys: env.array('APP_KEYS'),
  },
});