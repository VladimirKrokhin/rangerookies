import * as amqp from 'amqplib';
import {
  ExchangeType,
  QueueName,
  RabbitMQConfig,
  RabbitMQMessage,
  RoutingKey,
} from './types';

/**
 * Клиент для работы с RabbitMQ
 * Предоставляет методы для подключения, отправки и получения сообщений
 */
export class RabbitMQClient {
  private connection: any = null;
  private channel: any = null;
  private config: RabbitMQConfig;

  /**
   * Создает новый экземпляр RabbitMQ клиента
   * @param config Конфигурация подключения к RabbitMQ
   */
  constructor(config: RabbitMQConfig) {
    this.config = config;
  }

  /**
   * Подключается к RabbitMQ серверу
   * Создает exchange, queue и привязывает их друг к другу
   * @throws {Error} Если не удалось подключиться или создать канал
   */
  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.config.url);
      this.channel = await this.connection.createChannel();

      if (!this.channel) {
        throw new Error('Не удалось создать канал RabbitMQ');
      }

      // Создаём exchange
      await this.channel.assertExchange(
        this.config.exchange,
        this.config.exchangeType,
        {
          durable: true,
        },
      );

      // Создаём queue
      await this.channel.assertQueue(this.config.queue, { durable: true });

      // Привязываем queue к exchange
      await this.channel.bindQueue(
        this.config.queue,
        this.config.exchange,
        this.config.routingKey,
      );

      console.log(`Подключено к RabbitMQ: ${this.config.queue}`);
    } catch (error) {
      console.error('Не удалось подключиться к RabbitMQ:', error);
      throw error;
    }
  }

  /**
   * Отправляет сообщение в RabbitMQ
   * @param message Сообщение для отправки
   * @throws {Error} Если канал не инициализирован или не удалось отправить сообщение
   */
  async publish<T>(message: RabbitMQMessage<T>): Promise<void> {
    if (!this.channel) {
      throw new Error('Канал не инициализирован');
    }

    try {
      this.channel.publish(
        this.config.exchange,
        this.config.routingKey,
        Buffer.from(JSON.stringify(message)),
        { persistent: true },
      );
    } catch (error) {
      console.error('Не удалось отправить сообщение в RabbitMQ:', error);
      throw error;
    }
  }

  /**
   * Начинает прослушивание сообщений из очереди
   * @param routingKey Ключ маршрутизации для фильтрации сообщений
   * @param callback Функция обратного вызова для обработки сообщений
   * @throws {Error} Если канал не инициализирован или не удалось начать прослушивание
   */
  async consume(
    routingKey: RoutingKey,
    callback: (message: RabbitMQMessage) => Promise<void>,
  ): Promise<void> {
    if (!this.channel) {
      throw new Error('Канал не инициализирован');
    }

    try {
      console.log(`Начинаю принимать сообщения с routing key: ${routingKey}`);
      await this.channel.consume(this.config.queue, async (msg: any) => {
        if (msg) {
          try {
            const content = JSON.parse(
              msg.content.toString(),
            ) as RabbitMQMessage;
            console.log(
              `Получено сообщение с типом: ${content.type}, ожидается: ${routingKey}`,
            );
            if (content.type === routingKey) {
              console.log(`Обрабатываю сообщение с типом: ${content.type}`);
              await callback(content);
            } else {
              console.log(
                `Пропускаю сообщение с типом: ${content.type}, ожидается: ${routingKey}`,
              );
            }
            this.channel?.ack(msg);
          } catch (error) {
            console.error('Ошибка при обработке сообщения из RabbitMQ:', error);
            this.channel?.nack(msg, false, true);
          }
        }
      });
    } catch (error) {
      console.error('Не удалось начать приём сообщений из RabbitMQ:', error);
      throw error;
    }
  }

  /**
   * Закрывает соединение с RabbitMQ
   * Закрывает канал и соединение
   * @throws {Error} Если не удалось закрыть соединение
   */
  async close(): Promise<void> {
    try {
      await this.channel?.close();
      await this.connection?.close();
      console.log('Соединение с RabbitMQ закрыто');
    } catch (error) {
      console.error('Ошибка при закрытии соединения с RabbitMQ:', error);
      throw error;
    }
  }
}
