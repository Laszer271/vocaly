import { createProxyMiddleware } from 'http-proxy-middleware';

export default function(app) {
  app.use(
    '/',
    createProxyMiddleware({
      target: process.env.REACT_APP_API_URL || 'http://localhost:8000',
      changeOrigin: true,
    })
  );
};
