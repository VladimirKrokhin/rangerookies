import { Application, Request, Response } from 'express';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swaggerUiExpress from 'swagger-ui-express';
import { RoutingControllersOptions } from 'routing-controllers';

interface SwaggerOptions extends RoutingControllersOptions {
  swagger?: {
    path: string;
  };
}

/**
 * Настройка Swagger для документации API
 * @param app Приложение Express
 * @param options Опции для routing-controllers
 * @returns Приложение Express с настроенным Swagger
 */
export function useSwagger(
  app: Application,
  options: SwaggerOptions,
): Application {
  const storage = getMetadataArgsStorage();
  const spec = routingControllersToSpec(storage, options, {
    info: {
      title: 'API Сервиса Аутентификации',
      version: '1.0.0',
      description: 'API для сервиса аутентификации и управления пользователями',
    },
  });

  app.use(
    '/api/auth/api-docs',
    swaggerUiExpress.serve,
    swaggerUiExpress.setup(spec, {
      swaggerOptions: {
        url: '/api/auth/api-docs/swagger.json',
      },
    }),
  );

  app.get('/api/auth/api-docs/swagger.json', (_req: Request, res: Response) => {
    res.json(spec);
  });

  return app;
}
