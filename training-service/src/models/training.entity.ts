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
import { SeriesEntity } from './series.entity';
import { TrainingType } from '@app/dto';
import { AthleteEntity } from './athlete.entity';

/**
 * Сущность тренировки
 */
@Entity('training')
export class TrainingEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: TrainingType,
    default: TrainingType.FREE,
  })
  type!: TrainingType;

  @Column({ name: 'athlete_id' })
  athleteId!: number;

  @ManyToOne(() => AthleteEntity)
  @JoinColumn({ name: 'athlete_id' })
  athlete!: AthleteEntity;

  @OneToMany(() => SeriesEntity, series => series.training)
  series!: SeriesEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
