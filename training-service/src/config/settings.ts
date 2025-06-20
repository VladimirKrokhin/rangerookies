import dotenv from 'dotenv';
import path from 'path';

// Загружаем переменные окружения из файла .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Класс с настройками приложения
 */
class Settings {
  // Настройки приложения
  APP_HOST: string = process.env.APP_HOST || '0.0.0.0';
  APP_PORT: number = parseInt(process.env.APP_PORT || '8002');
  APP_PROTOCOL: string = process.env.APP_PROTOCOL || 'http';
  APP_CONTROLLERS_PATH: string =
    process.env.APP_CONTROLLERS_PATH || '/controllers/*.controller.js';
  APP_API_PREFIX: string = process.env.APP_API_PREFIX || '/api';

  // Настройки базы данных
  DB_HOST = process.env.DB_HOST || 'localhost';
  DB_PORT = parseInt(process.env.DB_PORT || '5432');
  DB_NAME = process.env.DB_NAME || 'maindb';
  DB_USER = process.env.DB_USER || 'maindb';
  DB_PASSWORD = process.env.DB_PASSWORD || 'maindb';
  DB_ENTITIES = process.env.DB_ENTITIES || 'dist/models/*.entity.js';
  DB_SUBSCRIBERS = process.env.DB_SUBSCRIBERS || 'dist/models/*.subscriber.js';

  // Настройки сервиса аутентификации
  AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:8001';
}

const SETTINGS = new Settings();

export default SETTINGS;
