import 'reflect-metadata';
import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import { useExpressServer, useContainer } from 'routing-controllers';
import { Container } from 'typedi';
import helmet from 'helmet';

import SETTINGS from './config/settings';
import { dataSource } from './config/database';
import { useSwagger } from './config/swagger';
import { ReferenceController } from './controllers/reference.controller';
import { HealthController } from './controllers/health.controller';
import { ExerciseController } from './controllers/exercise.controller';
import { WeaponTypeController } from './controllers/weapon-type.controller';
import { metricsMiddleware, metricsEndpoint } from './config/prometheus';
import { RabbitMQService } from './services/rabbitmq.service';
import { ReferenceService } from './services/reference.service';
import { authorizationChecker } from './middlewares/auth-checker';

// Используем контейнер TypeDI для инъекции зависимостей
useContainer(Container);

export class App {
  public port: number;
  public host: string;
  public protocol: string;

  private app: any;

  constructor(
    port: number = SETTINGS.APP_PORT,
    host: string = SETTINGS.APP_HOST,
    protocol: string = SETTINGS.APP_PROTOCOL,
  ) {
    this.port = port;
    this.host = host;
    this.protocol = protocol;
    this.app = express();
    this.configureApp();
  }

  /**
   * Настраивает приложение Express
   * @returns Настроенное приложение Express
   */
  private configureApp(): any {
    // Настройка метрик Prometheus
    this.app.use(metricsMiddleware);

    // Middleware
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.json());

    // Эндпоинт для метрик Prometheus
    this.app.get('/metrics', metricsEndpoint);

    // Настройка контроллеров
    const options = {
      controllers: [
        ReferenceController,
        HealthController,
        ExerciseController,
        WeaponTypeController,
      ],
      routePrefix: SETTINGS.APP_API_PREFIX,
      classTransformer: true,
      validation: true,
      authorizationChecker,
    };

    // Инициализируем Swagger перед routing-controllers
    this.app = useSwagger(this.app, options);
    this.app = useExpressServer(this.app, options);

    const rabbitMQService = new RabbitMQService();
    const referenceService = new ReferenceService();

    (async () => {
      await rabbitMQService.connect();
      await rabbitMQService.consumeReferenceDeleteRequests(referenceService);
    })();

    return this.app;
  }

  /**
   * Запускает сервер
   */
  public async start(): Promise<void> {
    try {
      await dataSource.initialize();
      console.log('Соединение с базой данных установлено');

      this.app.listen(this.port, () => {
        console.log(
          `Сервер запущен на ${this.protocol}://${this.host}:${this.port}`,
        );
      });
    } catch (error) {
      console.error('Ошибка при запуске сервера:', error);
      process.exit(1);
    }
  }

  public getApp(): any {
    return this.app;
  }
}

new App().start();

export default App;
