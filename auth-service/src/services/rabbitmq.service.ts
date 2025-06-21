import { RabbitMQClient, RabbitMQMessage, RoutingKey } from '@app/common';
import { rabbitMQConfig } from '../config/rabbitmq';
import { Service } from 'typedi';

/**
 * Сервис для работы с RabbitMQ в auth-service
 * Отправляет события о создании, обновлении и удалении пользователей
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
   * Отправляет событие о создании пользователя
   * @param userId ID созданного пользователя
   */
  async publishUserCreated(userId: string): Promise<void> {
    const message: RabbitMQMessage = {
      type: RoutingKey.USER_CREATED,
      data: { userId },
      timestamp: Date.now(),
    };
    await this.client.publish(message);
  }

  /**
   * Отправляет событие об обновлении пользователя
   * @param userId ID обновленного пользователя
   */
  async publishUserUpdated(userId: string): Promise<void> {
    const message: RabbitMQMessage = {
      type: RoutingKey.USER_UPDATED,
      data: { userId },
      timestamp: Date.now(),
    };
    await this.client.publish(message);
  }

  /**
   * Отправляет событие об удалении пользователя
   * @param userId ID удаленного пользователя
   */
  async publishUserDeleted(userId: string): Promise<void> {
    const message: RabbitMQMessage = {
      type: RoutingKey.USER_DELETED,
      data: { userId },
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
    // Можно добавить более строгую проверку, если потребуется
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return !!(this.client as any).connection && (this.client as any).connection.connection !== null;
  }
}
