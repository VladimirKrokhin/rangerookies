import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { TrainingEntity } from './training.entity';

/**
 * Сущность квалификационной тренировки
 */
@Entity('qualification_trainings')
export class QualificationTrainingEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'int' })
  training_id!: number;

  @ManyToOne(() => TrainingEntity)
  @JoinColumn({ name: 'training_id' })
  training!: TrainingEntity;

  @Column({ type: 'smallint' })
  exercise_id!: number;
}
