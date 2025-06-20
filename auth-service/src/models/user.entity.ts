import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Сущность пользователя в системе
 * Содержит основную информацию о пользователе: логин, email, пароль, имя
 */
@Entity('users')
export class UserEntity {
  /** Уникальный идентификатор пользователя */
  @PrimaryGeneratedColumn({ type: 'int' })
  id!: number;

  /** Имя пользователя (логин) */
  @Column({ type: 'varchar' })
  username!: string;

  /** Email пользователя (уникальный) */
  @Column({ type: 'varchar', unique: true })
  email!: string;

  /** Хешированный пароль пользователя */
  @Column({ type: 'varchar' })
  password_hash!: string;

  /** Имя пользователя (опционально) */
  @Column({ type: 'varchar', nullable: true })
  first_name?: string;

  /** Фамилия пользователя (опционально) */
  @Column({ type: 'varchar', nullable: true })
  last_name?: string;

  /** Дата и время создания записи */
  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  /** Дата и время последнего обновления записи */
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at!: Date;
}
