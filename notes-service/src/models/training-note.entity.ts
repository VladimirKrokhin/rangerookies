import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { NoteEntity } from './note.entity';

/**
 * Сущность заметки к тренировке
 */
@Entity('training_notes')
export class TrainingNoteEntity extends BaseEntity {
  @Column({ type: 'bigint', name: 'note_id' })
  noteId: number;

  @ManyToOne(() => NoteEntity)
  @JoinColumn({ name: 'note_id' })
  note: NoteEntity;

  @Column({ type: 'int', name: 'training_id' })
  trainingId: number;
}
