/**
 * Пакет DTO (Data Transfer Objects)
 * Содержит все объекты передачи данных для API
 */

// Экспорт DTO для тренировок
export * from './training.dto';

// Экспорт DTO для серий
export * from './series.dto';

// Экспорт DTO для выстрелов
export * from './shot.dto';

// Экспорт интерфейсов
export * from './interfaces/index';

// Экспорт DTO для аутентификации
export * from './auth.dto';

// Экспорт DTO для пользователей
export * from './user.dto';

// Экспорт DTO для заметок
export * from './note.dto';

// Экспорт DTO для тренеров
export * from './coach.dto';

// Экспорт DTO для спортсменов
export * from './athlete.dto';

// Экспорт DTO для справочников
export * from './reference.dto';

// Экспорт DTO для RabbitMQ
export * from './rabbitmq.dto';

// Экспорт перечислений
export * from './enums';
