import client from 'prom-client';

// Настройка метрик Prometheus
const register = new client.Registry();

// Добавляем default label, который добавляется ко всем метрикам
register.setDefaultLabels({
  app: 'notes-service',
});

// Включаем сбор дефолтных метрик
client.collectDefaultMetrics({ register });

// Создаем кастомные метрики
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

// Регистрируем метрики
register.registerMetric(httpRequestDurationMicroseconds);

// Middleware для сбора метрик
export const metricsMiddleware = (req: any, res: any, next: any) => {
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
export const metricsEndpoint = async (_: any, res: any) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
};

export default {
  metricsMiddleware,
  metricsEndpoint,
};
