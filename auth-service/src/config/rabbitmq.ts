import {
  ExchangeType,
  QueueName,
  RabbitMQConfig,
  RoutingKey,
} from '@app/common';

/**
 * Конфигурация RabbitMQ для auth-service
 * Настройки подключения, exchange, очереди и ключа маршрутизации
 */
export const rabbitMQConfig: RabbitMQConfig = {
  url: process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost:5672',
  exchange: 'auth.exchange',
  exchangeType: ExchangeType.DIRECT,
  queue: QueueName.AUTH_EVENTS,
  routingKey: RoutingKey.USER_CREATED,
};
