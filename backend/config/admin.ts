module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  sessions: {
    enabled: true,
    secure: false, // 👈 disables secure flag for cookies
    sameSite: 'none', // optional but safer behind proxy
  },
  url: '/admin',
});
