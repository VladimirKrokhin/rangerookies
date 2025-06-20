import { DataSource } from 'typeorm';
import SETTINGS from './settings';
import { TrainingEntity } from '../models/training.entity';
import { FreeTrainingEntity } from '../models/free-training.entity';
import { QualificationTrainingEntity } from '../models/qualification-training.entity';
import { SeriesEntity } from '../models/series.entity';
import { ShotEntity } from '../models/shot.entity';
import { AthleteEntity } from '../models/athlete.entity';
import { CoachEntity } from '../models/coach.entity';

export const dataSource = new DataSource({
  type: 'postgres',
  host: SETTINGS.DB_HOST,
  port: SETTINGS.DB_PORT,
  username: SETTINGS.DB_USER,
  password: SETTINGS.DB_PASSWORD,
  database: SETTINGS.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [
    TrainingEntity,
    FreeTrainingEntity,
    QualificationTrainingEntity,
    SeriesEntity,
    ShotEntity,
    AthleteEntity,
    CoachEntity,
  ],
  subscribers: [],
  migrations: [],
});
