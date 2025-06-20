import {
  ExchangeType,
  QueueName,
  RabbitMQConfig,
  RoutingKey,
} from '@app/common';
import { RabbitMQMessageDto } from '@app/dto';

/**
 * Конфигурация RabbitMQ для training-service
 * Настройки подключения, exchange, очереди и ключа маршрутизации
 */
export const rabbitMQConfig: RabbitMQConfig = {
  url: process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672',
  exchange: 'training.exchange',
  exchangeType: ExchangeType.DIRECT,
  queue: QueueName.TRAINING_EVENTS,
  routingKey: RoutingKey.TRAINING_CREATED,
};
