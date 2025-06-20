import { DataSource } from 'typeorm';
import SETTINGS from './settings';
import { NoteEntity } from '../models/note.entity';
import { TrainingNoteEntity } from '../models/training-note.entity';
import { SeriesNoteEntity } from '../models/series-note.entity';

export const dataSource = new DataSource({
  type: 'postgres',
  host: SETTINGS.DB_HOST,
  port: SETTINGS.DB_PORT,
  username: SETTINGS.DB_USER,
  password: SETTINGS.DB_PASSWORD,
  database: SETTINGS.DB_NAME,
  synchronize: true, // В продакшене должно быть false
  logging: false,
  entities: [NoteEntity, TrainingNoteEntity, SeriesNoteEntity],
  subscribers: [],
  migrations: [],
});
