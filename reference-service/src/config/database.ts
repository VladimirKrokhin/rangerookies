import { DataSource } from 'typeorm';
import SETTINGS from './settings';
import { TargetEntity } from '../models/target.entity';
import { WeaponTypeEntity } from '../models/weapon-type.entity';
import { ExerciseEntity } from '../models/exercise.entity';

export const dataSource = new DataSource({
  type: 'postgres',
  host: SETTINGS.DB_HOST,
  port: SETTINGS.DB_PORT,
  username: SETTINGS.DB_USER,
  password: SETTINGS.DB_PASSWORD,
  database: SETTINGS.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [TargetEntity, WeaponTypeEntity, ExerciseEntity],
  subscribers: [],
  migrations: [],
});
