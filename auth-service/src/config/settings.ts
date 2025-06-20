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
  APP_PORT: number = parseInt(process.env.APP_PORT || '8001');
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

  // Настройки JWT
  JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';
  JWT_REFRESH_SECRET_KEY =
    process.env.JWT_REFRESH_SECRET_KEY || 'your-refresh-secret-key';
  JWT_TOKEN_TYPE = process.env.JWT_TOKEN_TYPE || 'Bearer';
  JWT_ACCESS_TOKEN_LIFETIME = process.env.JWT_ACCESS_TOKEN_LIFETIME || '1h';
  JWT_REFRESH_TOKEN_LIFETIME = process.env.JWT_REFRESH_TOKEN_LIFETIME || '1h';
}

const SETTINGS = new Settings();

export default SETTINGS;
