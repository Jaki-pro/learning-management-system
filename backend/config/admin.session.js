// path: ./config/admin.session.js
module.exports = ({ env }) => ({
  enabled: true,
  secure: false, // 👈 Disable "secure" cookies inside Railway
  sameSite: 'none', // 👈 Allow cross-site cookies (admin frontend to backend)
});
