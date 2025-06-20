import { DataSource } from 'typeorm';
import { WeaponTypeEntity } from '../models/weapon-type.entity';
import { TargetEntity } from '../models/target.entity';
import { ExerciseEntity } from '../models/exercise.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'reference_service',
  synchronize: true,
  logging: true,
  entities: [WeaponTypeEntity, TargetEntity, ExerciseEntity],
  subscribers: [],
  migrations: [],
});

export default dataSource;
