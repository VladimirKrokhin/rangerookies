import {
  RabbitMQConfig,
  ExchangeType,
  QueueName,
  RoutingKey,
} from '@app/common';

export const rabbitMQConfig: RabbitMQConfig = {
  url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
  exchange: 'training_exchange',
  exchangeType: ExchangeType.TOPIC,
  queue: QueueName.NOTES_EVENTS,
  routingKey: RoutingKey.TRAINING_DELETED,
};
