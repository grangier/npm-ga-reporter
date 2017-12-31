// Set environment variables to configure the application.

module.exports = {
  email: process.env.ANALYTICS_REPORT_EMAIL,
  key: process.env.ANALYTICS_KEY,
  key_file: process.env.ANALYTICS_KEY_PATH,
  analytics_credentials: process.env.ANALYTICS_CREDENTIALS,
  reports_path: process.env.ANALYTICS_REPORTS_PATH,
  debug: (process.env.ANALYTICS_DEBUG ? true : false),
};
