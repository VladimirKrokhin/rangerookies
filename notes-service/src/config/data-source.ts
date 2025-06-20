import { DataSource } from 'typeorm';
import { NoteEntity } from '../models/note.entity';
import { SeriesNoteEntity } from '../models/series-note.entity';
import { TrainingNoteEntity } from '../models/training-note.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'notes_service',
  synchronize: true,
  logging: true,
  entities: [NoteEntity, SeriesNoteEntity, TrainingNoteEntity],
  subscribers: [],
  migrations: [],
});

export default dataSource;
