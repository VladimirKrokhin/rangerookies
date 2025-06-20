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
 * Сущность свободной тренировки
 */
@Entity('free_trainings')
export class FreeTrainingEntity extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  @Column({ type: 'int' })
  training_id!: number;

  @ManyToOne(() => TrainingEntity)
  @JoinColumn({ name: 'training_id' })
  training!: TrainingEntity;

  @Column({ type: 'int' })
  weapon_type_id!: number;

  @Column({ type: 'int' })
  target_id!: number;
}
