import { DataSource } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { UserSubscriber } from '../models/user.subscriber';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'authdb',
  entities: [UserEntity],
  synchronize: true, // В продакшене должно быть false
  logging: true,
  subscribers: [UserSubscriber],
  migrations: [],
});
