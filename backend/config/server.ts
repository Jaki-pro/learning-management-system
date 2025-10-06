export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', process.env.PORT || 3000),
  proxy: true,
  app: {
    keys: env.array('APP_KEYS'),
  },
});
