import {
  RabbitMQClient,
  RabbitMQMessage,
  RoutingKey,
  ExchangeType,
  QueueName,
} from '@app/common';
import { ReferenceService } from './reference.service';
import { Service } from 'typedi';

@Service()
export class RabbitMQService {
  private client: RabbitMQClient;

  constructor() {
    this.client = new RabbitMQClient({
      url: process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672',
      exchange: process.env.RABBITMQ_EXCHANGE || 'microservice_exchange',
      exchangeType: ExchangeType.DIRECT,
      queue: QueueName.REFERENCE_EVENTS,
      routingKey: RoutingKey.REFERENCE_DELETED,
    });
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async consumeReferenceDeleteRequests(referenceService: ReferenceService) {
    await this.client.consume(
      RoutingKey.REFERENCE_DELETED,
      async (message: RabbitMQMessage) => {
        if (message.type === RoutingKey.REFERENCE_DELETED) {
          const referenceId = message.data.id;
          const isUsed = await referenceService.isReferenceUsed(referenceId);
          if (isUsed) {
            await this.client.publish({
              type: RoutingKey.REFERENCE_DELETED,
              data: { id: referenceId },
              timestamp: Date.now(),
            });
          } else {
            await this.client.publish({
              type: RoutingKey.REFERENCE_DELETED,
              data: { id: referenceId },
              timestamp: Date.now(),
            });
          }
        }
      },
    );
  }

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
