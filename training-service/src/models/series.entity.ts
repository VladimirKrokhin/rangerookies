import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TrainingEntity } from './training.entity';
import { ShotEntity } from './shot.entity';
import { TrainingType } from '@app/dto';

/**
 * Сущность серии
 */
@Entity('series')
export class SeriesEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'training_id' })
  trainingId!: number;

  @ManyToOne(() => TrainingEntity, training => training.series)
  @JoinColumn({ name: 'training_id' })
  training!: TrainingEntity;

  @OneToMany(() => ShotEntity, shot => shot.series)
  shots!: ShotEntity[];

  @Column({ type: 'int' })
  order!: number;

  @Column({ type: 'enum', enum: TrainingType })
  type!: TrainingType;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
