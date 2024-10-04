const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://fg34mraeml.execute-api.eu-west-2.amazonaws.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/dev', // Rewrite the API path from /api to /dev
      },
    })
  );
};
