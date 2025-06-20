import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SeriesEntity } from './series.entity';

/**
 * Сущность выстрела
 */
@Entity('shot')
export class ShotEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'series_id' })
  seriesId!: number;

  @ManyToOne(() => SeriesEntity, series => series.shots)
  @JoinColumn({ name: 'series_id' })
  series!: SeriesEntity;

  @Column()
  order!: number;

  @Column({ type: 'float' })
  score!: number;

  @Column({ type: 'float' })
  x!: number;

  @Column({ type: 'float' })
  y!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
