import {
  RabbitMQClient,
  RabbitMQMessage,
  RoutingKey,
  ExchangeType,
  QueueName,
} from '@app/common';
import { Service } from 'typedi';

@Service()
export class RabbitMQService {
  private client: RabbitMQClient;

  constructor() {
    this.client = new RabbitMQClient({
      url: process.env.RABBITMQ_URL || 'amqp://admin:admin@rabbitmq:5672',
      exchange: 'training.exchange',
      exchangeType: ExchangeType.DIRECT,
      queue: QueueName.TRAINING_EVENTS,
      routingKey: RoutingKey.TRAINING_DELETED,
    });
  }

  async connect() {
    await this.client.connect();
  }

  async disconnect() {
    await this.client.close();
  }

  async publishNoteCreated(noteId: number, userId: number, content: string) {
    const message: RabbitMQMessage = {
      type: RoutingKey.NOTE_CREATED,
      data: {
        noteId,
        userId,
        content,
      },
      timestamp: Date.now(),
    };
    await this.client.publish(message);
  }

  async publishNoteUpdated(noteId: number, userId: number, content: string) {
    const message: RabbitMQMessage = {
      type: RoutingKey.NOTE_UPDATED,
      data: {
        noteId,
        userId,
        content,
      },
      timestamp: Date.now(),
    };
    await this.client.publish(message);
  }

  async publishNoteDeleted(noteId: number, userId: number) {
    const message: RabbitMQMessage = {
      type: RoutingKey.NOTE_DELETED,
      data: {
        noteId,
        userId,
      },
      timestamp: Date.now(),
    };
    await this.client.publish(message);
  }

  async consumeTrainingDeleted(callback: (data: any) => Promise<void>) {
    await this.client.consume(RoutingKey.TRAINING_DELETED, callback);
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
