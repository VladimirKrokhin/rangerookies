import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TargetEntity } from './target.entity';
import { WeaponTypeEntity } from './weapon-type.entity';

/**
 * Сущность упражнения
 */
@Entity('exercises')
export class ExerciseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ nullable: true, type: 'text' })
  description!: string | null;

  @ManyToOne(() => TargetEntity, target => target.exercises)
  @JoinColumn({ name: 'target_id' })
  target!: TargetEntity;

  @Column({ name: 'target_id' })
  targetId!: number;

  @ManyToOne(() => WeaponTypeEntity, weaponType => weaponType.exercises)
  @JoinColumn({ name: 'weapon_type_id' })
  weaponType!: WeaponTypeEntity;

  @Column({ name: 'weapon_type_id' })
  weaponTypeId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
