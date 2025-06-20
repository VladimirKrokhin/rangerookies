/**
 * Типы обмена сообщениями в RabbitMQ
 */
export enum ExchangeType {
  DIRECT = 'direct',
  FANOUT = 'fanout',
  TOPIC = 'topic',
  HEADERS = 'headers',
}

/**
 * Названия очередей для различных сервисов
 */
export enum QueueName {
  AUTH_EVENTS = 'auth.events',
  TRAINING_EVENTS = 'training.events',
  REFERENCE_EVENTS = 'reference.events',
  NOTES_EVENTS = 'notes.events',
  AUTH_QUEUE = 'auth_queue',
  TRAINING_QUEUE = 'training_queue',
  REFERENCE_QUEUE = 'reference_queue',
  NOTES_QUEUE = 'notes_queue',
}

/**
 * Ключи маршрутизации для различных событий
 */
export enum RoutingKey {
  // Auth события
  USER_CREATED = 'user.created',
  USER_UPDATED = 'user.updated',
  USER_DELETED = 'user.deleted',

  // События, связанные с тренировками
  TRAINING_CREATED = 'training.created',
  TRAINING_UPDATED = 'training.updated',
  TRAINING_DELETED = 'training.deleted',
  TRAINING_PROGRESS = 'training.progress',

  // События со справочными данными
  REFERENCE_CREATED = 'reference.created',
  REFERENCE_UPDATED = 'reference.updated',
  REFERENCE_DELETED = 'reference.deleted',
  REFERENCE_DELETE_REQUESTED = 'reference.delete.requested',
  REFERENCE_DELETE_ALLOWED = 'reference.delete.allowed',
  REFERENCE_DELETE_DENIED = 'reference.delete.denied',

  // События с заметками
  NOTE_CREATED = 'note.created',
  NOTE_UPDATED = 'note.updated',
  NOTE_DELETED = 'note.deleted',
}

/**
 * Интерфейс сообщения RabbitMQ
 */
export interface RabbitMQMessage<T = any> {
  /** Тип события */
  type: RoutingKey;
  /** Данные сообщения */
  data: T;
  /** Временная метка создания сообщения */
  timestamp: number;
  /** Идентификатор корреляции (опционально) */
  correlationId?: string;
}

/**
 * Конфигурация подключения к RabbitMQ
 */
export interface RabbitMQConfig {
  /** URL подключения к RabbitMQ */
  url: string;
  /** Название exchange */
  exchange: string;
  /** Тип exchange */
  exchangeType: ExchangeType;
  /** Название очереди */
  queue: QueueName;
  /** Ключ маршрутизации */
  routingKey: RoutingKey;
}
