import 'reflect-metadata';
import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import {
  useExpressServer,
  useContainer,
  RoutingControllersOptions,
} from 'routing-controllers';
import { Container } from 'typedi';
import helmet from 'helmet';
import { json } from 'body-parser';
import { AppDataSource } from './config/database';

import SETTINGS from './config/settings';
import { useSwagger } from './config/swagger';
import { UserController } from './controllers/user.controller';
import { HealthController } from './controllers/health.controller';
import { AuthController } from './controllers/auth.controller';
import { metricsMiddleware, metricsEndpoint } from './config/prometheus';
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
    this.app.use((req, res, next) => {
      console.log(`[LOG] ${req.method} ${req.url}`);
      next();
    });
    
    // Временно отключаем все middleware для диагностики
    // this.app.use(cors());
    // this.app.use(helmet());
    // this.app.use(json());

    // Эндпоинт для метрик Prometheus
    this.app.get('/metrics', metricsEndpoint);

    // Настройка контроллеров
    const options: RoutingControllersOptions = {
      controllers: [HealthController, UserController, AuthController],
      routePrefix: '/api',
      classTransformer: true,
      validation: true,
      authorizationChecker,
    };
    
    console.log('Регистрируем контроллеры:', options.controllers.map(c => c.name));
    
    useSwagger(this.app, {
      ...options,
      swagger: { path: '/api/auth/api-docs' },
    });
    useExpressServer(this.app, options);
    console.log('Swagger инициализирован с опциями:', options);

    return this.app;
  }

  /**
   * Запускает сервер
   */
  public async start(): Promise<void> {
    try {
      await AppDataSource.initialize();
      console.log('Соединение с базой данных установлено');

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
