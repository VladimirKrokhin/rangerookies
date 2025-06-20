import express from 'express';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swaggerUiExpress from 'swagger-ui-express';

/**
 * Настройка Swagger для документации API
 * @param app Приложение Express
 * @param options Опции для routing-controllers
 * @returns Приложение Express с настроенным Swagger
 */
export function useSwagger(
  app: express.Application,
  options: Record<string, unknown>,
): express.Application {
  const storage = getMetadataArgsStorage();
  const spec = routingControllersToSpec(storage, options, {
    info: {
      title: 'API Сервиса Справочных Данных',
      version: '1.0.0',
      description: 'API для сервиса справочников',
    },
  });

  app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec));

  return app;
}
