import { RabbitMQClient, RabbitMQMessage, RoutingKey } from '@app/common';
import { rabbitMQConfig } from '../config/rabbitmq';
import { RabbitMQMessageDto } from '@app/dto';
import { Service } from 'typedi';

/**
 * Сервис для работы с RabbitMQ в training-service
 * Отправляет события о создании, обновлении, удалении тренировок и прогрессе
 */
@Service()
export class RabbitMQService {
  private client: RabbitMQClient;

  /**
   * Создает новый экземпляр RabbitMQ сервиса
   */
  constructor() {
    this.client = new RabbitMQClient(rabbitMQConfig);
  }

  /**
   * Подключается к RabbitMQ
   */
  async connect(): Promise<void> {
    await this.client.connect();
  }

  /**
   * Отправляет сообщение с указанным ключом маршрутизации
   * @param routingKey Ключ маршрутизации
   * @param data Данные для отправки
   */
  async sendMessage<T>(routingKey: RoutingKey, data: T): Promise<void> {
    const message: RabbitMQMessage<T> = {
      type: routingKey,
      data,
      timestamp: Date.now(),
    };
    await this.client.publish(message);
  }

  /**
   * Отправляет событие о создании тренировки
   * @param trainingId ID созданной тренировки
   * @param type Тип тренировки
   * @param data Данные тренировки
   */
  async publishTrainingCreated(
    trainingId: number,
    type: string,
    data: any,
  ): Promise<void> {
    const message: RabbitMQMessage<{ id: number; type: string; data: any }> = {
      type: RoutingKey.TRAINING_CREATED,
      data: { id: trainingId, type, data },
      timestamp: Date.now(),
    };
    await this.client.publish(message);
  }

  /**
   * Отправляет событие об обновлении тренировки
   * @param trainingId ID обновленной тренировки
   * @param type Тип тренировки
   * @param data Обновленные данные тренировки
   */
  async publishTrainingUpdated(
    trainingId: number,
    type: string,
    data: any,
  ): Promise<void> {
    const message: RabbitMQMessage<{ id: number; type: string; data: any }> = {
      type: RoutingKey.TRAINING_UPDATED,
      data: { id: trainingId, type, data },
      timestamp: Date.now(),
    };
    await this.client.publish(message);
  }

  /**
   * Отправляет событие об удалении тренировки
   * @param trainingId ID удаленной тренировки
   */
  async publishTrainingDeleted(trainingId: number): Promise<void> {
    const message: RabbitMQMessage<{ id: number }> = {
      type: RoutingKey.TRAINING_DELETED,
      data: { id: trainingId },
      timestamp: Date.now(),
    };
    await this.client.publish(message);
  }

  /**
   * Отправляет событие о прогрессе тренировки
   * @param trainingId ID тренировки
   * @param progress Прогресс тренировки (0-100)
   */
  async publishTrainingProgress(
    trainingId: number,
    progress: number,
  ): Promise<void> {
    const message: RabbitMQMessage<{ id: number; progress: number }> = {
      type: RoutingKey.TRAINING_PROGRESS,
      data: { id: trainingId, progress },
      timestamp: Date.now(),
    };
    await this.client.publish(message);
  }

  /**
   * Закрывает соединение с RabbitMQ
   */
  async close(): Promise<void> {
    await this.client.close();
  }

  /**
   * Проверяет, установлено ли соединение с RabbitMQ
   */
  isConnected(): boolean {
    // Внутри RabbitMQClient есть connection, если оно не null, значит соединение есть
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !!(this.client as any).connection && (this.client as any).connection.connection !== null;
  }
}
