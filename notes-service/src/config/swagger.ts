import { Express } from 'express';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { getMetadataArgsStorage } from 'routing-controllers';
import swaggerUi from 'swagger-ui-express';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { Request, Response } from 'express';

export const useSwagger = (app: Express, options: any) => {
  const schemas = validationMetadatasToSchemas({
    refPointerPrefix: '#/components/schemas/',
  }) as Record<string, any>;

  const spec = routingControllersToSpec(getMetadataArgsStorage(), options, {
    components: {
      schemas,
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    info: {
      title: 'Notes Service API',
      version: '1.0.0',
      description: 'Документация API для сервиса заметок',
    },
  });

  // Добавляем маршрут для получения swagger.json
  app.get('/api-docs/swagger.json', (_: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.json(spec);
  });

  // Настройка Swagger UI с явным указанием пути для swagger.json
  app.use(
    '/api-docs/',
    swaggerUi.serve,
    swaggerUi.setup(spec, {
      swaggerOptions: {
        url: '/api-docs/swagger.json',
        persistAuthorization: true,
      },
    }),
  );

  return app;
};
