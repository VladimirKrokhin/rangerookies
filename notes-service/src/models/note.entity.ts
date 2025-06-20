import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

/**
 * Сущность заметки
 */
@Entity('notes')
export class NoteEntity extends BaseEntity {
  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @Column({ type: 'timestamp', nullable: true, name: 'edited_at' })
  editedAt: Date | null;

  @Column({ type: 'text' })
  content: string;
}
