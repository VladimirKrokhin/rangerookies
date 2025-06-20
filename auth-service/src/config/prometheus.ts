import client from 'prom-client';
import { Request, Response, NextFunction } from 'express';

// Настройка метрик Prometheus
const register = new client.Registry();
register.setDefaultLabels({
  app: 'auth-service',
});
client.collectDefaultMetrics({ register });

// Создаем метрики
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

// Регистрируем метрики
register.registerMetric(httpRequestDurationMicroseconds);

// Middleware для сбора метрик
export const metricsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    httpRequestDurationMicroseconds
      .labels(
        req.method,
        req.route?.path || req.path,
        res.statusCode.toString(),
      )
      .observe(duration / 1000);
  });
  next();
};

// Эндпоинт для метрик Prometheus
export const metricsEndpoint = async (_req: Request, res: Response) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
};

export default {
  metricsMiddleware,
  metricsEndpoint,
};
