import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { CoachEntity } from './coach.entity';

/**
 * Сущность спортсмена
 */
@Entity('athletes')
export class AthleteEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @ManyToMany(() => CoachEntity)
  @JoinTable({
    name: 'athlete_coaches',
    joinColumn: {
      name: 'athlete_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'coach_id',
      referencedColumnName: 'id',
    },
  })
  coaches!: CoachEntity[];
}
