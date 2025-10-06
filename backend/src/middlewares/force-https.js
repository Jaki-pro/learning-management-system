// path: ./src/middlewares/force-https.js

module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    // Force Strapi to treat every request as HTTPS
    ctx.request.secure = true;
    ctx.request.protocol = 'https';
    ctx.req.secure = true;
    ctx.req.headers['x-forwarded-proto'] = 'https';
    await next();
  };
};
