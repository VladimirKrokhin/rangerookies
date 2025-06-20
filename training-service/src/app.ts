import 'reflect-metadata';
import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import {
  useExpressServer,
  useContainer,
  RoutingControllersOptions,
} from 'routing-controllers';
import { Container } from 'typedi';
import SETTINGS from './config/settings';
import { dataSource } from './config/database';
import { routingControllersOptions } from './config/routing-controllers';
import swaggerUi from 'swagger-ui-express';
import { useSwagger } from './config/swagger';
import { metricsMiddleware, metricsEndpoint } from './config/prometheus';
import { HealthController } from './controllers/health.controller';
import { AthleteController } from './controllers/athlete.controller';
import { CoachController } from './controllers/coach.controller';
import { FreeTrainingController } from './controllers/free-training.controller';
import { QualificationTrainingController } from './controllers/qualification-training.controller';
import { SeriesController } from './controllers/series.controller';
import { ShotController } from './controllers/shot.controller';
import { TrainingController } from './controllers/training.controller';
import { RabbitMQService } from './services/rabbitmq.service';
import { authorizationChecker } from './middlewares/auth-checker';

// Используем контейнер TypeDI для инъекции зависимостей
useContainer(Container);

export class App {
  public port: number;
  public host: string;
  public protocol: string;

  private app: any;
  private rabbitMQService: RabbitMQService;

  constructor(
    port: number = SETTINGS.APP_PORT,
    host: string = SETTINGS.APP_HOST,
    protocol: string = SETTINGS.APP_PROTOCOL,
  ) {
    this.port = port;
    this.host = host;
    this.protocol = protocol;
    this.app = express();
    this.rabbitMQService = new RabbitMQService();
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
    const options: RoutingControllersOptions = {
      controllers: [
        HealthController,
        AthleteController,
        CoachController,
        FreeTrainingController,
        QualificationTrainingController,
        SeriesController,
        ShotController,
        TrainingController,
      ],
      routePrefix: SETTINGS.APP_API_PREFIX,
      classTransformer: true,
      validation: true,
      authorizationChecker,
    };
    useSwagger(this.app, { ...options, swagger: { path: '/api-docs' } });
    useExpressServer(this.app, options);
    console.log('Swagger инициализирован с опциями:', options);

    return this.app;
  }

  /**
   * Запускает сервер
   */
  public async start(): Promise<void> {
    try {
      await dataSource.initialize();
      console.log('Соединение с базой данных установлено');

      // Явно синхронизируем схему базы данных
      await dataSource.synchronize(true);
      console.log('Схема базы данных синхронизирована');

      await this.rabbitMQService.connect();
      console.log('Соединение с RabbitMQ установлено');

      this.app.listen(this.port, () => {
        console.log(
          `Сервер запущен на ${this.protocol}://${this.host}:${this.port}`,
        );
      });

      // Обработка завершения работы
      process.on('SIGTERM', async () => {
        console.log('SIGTERM получен. Закрытие соединения с RabbitMQ...');
        await this.rabbitMQService.close();
        process.exit(0);
      });

      process.on('SIGINT', async () => {
        console.log('SIGINT получен. Закрытие соединения с RabbitMQ...');
        await this.rabbitMQService.close();
        process.exit(0);
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
