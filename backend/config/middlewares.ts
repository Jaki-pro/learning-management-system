module.exports = [
  'global::force-https', // 👈 your custom middleware (make sure it's first!)
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::session',
  'strapi::body',
  'strapi::favicon',
  'strapi::public',
];
