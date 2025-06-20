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
import { NoteController } from './controllers/note.controller';
import { metricsMiddleware, metricsEndpoint } from './config/prometheus';
import healthRouter from './routes/health.routes';
import { RabbitMQService } from './services/rabbitmq.service';
import { NoteService } from './services/note.service';
import { NoteEntity } from './models/note.entity';
import { TrainingNoteEntity } from './models/training-note.entity';
import { SeriesNoteEntity } from './models/series-note.entity';
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
      controllers: [NoteController],
      classTransformer: true,
      validation: true,
      defaultErrorHandler: false,
      classToPlainTransformOptions: {
        excludeExtraneousValues: true,
      },
      authorizationChecker,
    };

    // Инициализируем Swagger перед routing-controllers
    this.app = useSwagger(this.app, options);
    this.app = useExpressServer(this.app, options);

    // Эндпоинт для проверки здоровья (после routing-controllers)
    this.app.use('/health', healthRouter);

    return this.app;
  }

  /**
   * Запускает сервер
   */
  public async start(): Promise<void> {
    try {
      await dataSource.initialize();
      console.log('Соединение с базой данных установлено');

      const rabbitMQService = new RabbitMQService();
      const noteRepository = dataSource.getRepository(NoteEntity);
      const trainingNoteRepository =
        dataSource.getRepository(TrainingNoteEntity);
      const seriesNoteRepository = dataSource.getRepository(SeriesNoteEntity);
      const noteService = new NoteService(
        noteRepository,
        trainingNoteRepository,
        seriesNoteRepository,
      );

      await rabbitMQService.connect();

      // Подписываемся на события удаления тренировки
      await rabbitMQService.consumeTrainingDeleted(async data => {
        console.log('Получено событие удаления тренировки:', data);
        const { trainingId } = data;
        console.log(`Удаление заметок для тренировки с ID: ${trainingId}`);
        await noteService.deleteNotesByTrainingId(trainingId);
        console.log(
          `Заметки для тренировки с ID: ${trainingId} успешно удалены`,
        );
      });

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
