import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { NoteEntity } from './note.entity';

/**
 * Сущность заметки к серии
 */
@Entity('series_notes')
export class SeriesNoteEntity extends BaseEntity {
  @Column({ type: 'bigint', name: 'note_id' })
  noteId: number;

  @ManyToOne(() => NoteEntity)
  @JoinColumn({ name: 'note_id' })
  note: NoteEntity;

  @Column({ type: 'bigint', name: 'series_id' })
  seriesId: number;
}
