import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

/**
 * Базовая сущность с полями created_at и updated_at
 */
export abstract class BaseEntity {
  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at!: Date;
}
