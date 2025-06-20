import { Service } from 'typedi';
import { dataSource } from '../config/database';
import { ExerciseEntity } from '../models/exercise.entity';
import { TargetEntity } from '../models/target.entity';
import { WeaponTypeEntity } from '../models/weapon-type.entity';
import {
  ExerciseDto,
  TargetDto,
  WeaponTypeDto,
  CreateExerciseDto,
  UpdateExerciseDto,
  CreateTargetDto,
  UpdateTargetDto,
  CreateWeaponTypeDto,
  UpdateWeaponTypeDto,
} from '@app/dto';

@Service()
export class ReferenceService {
  // Упражнения
  async getAllExercises(): Promise<ExerciseDto[]> {
    const exercises = await dataSource.getRepository(ExerciseEntity).find();
    return exercises.map(exercise => this.mapExerciseToDto(exercise));
  }

  async getExerciseById(id: number): Promise<ExerciseDto> {
    const exercise = await dataSource
      .getRepository(ExerciseEntity)
      .findOne({ where: { id } });
    if (!exercise) {
      throw new Error('Упражнение не найдено');
    }
    return this.mapExerciseToDto(exercise);
  }

  async createExercise(dto: CreateExerciseDto): Promise<ExerciseDto> {
    const exercise = dataSource.getRepository(ExerciseEntity).create(dto);
    const savedExercise = await dataSource
      .getRepository(ExerciseEntity)
      .save(exercise);
    return this.mapExerciseToDto(savedExercise);
  }

  async updateExercise(
    id: number,
    dto: UpdateExerciseDto,
  ): Promise<ExerciseDto> {
    const exercise = await dataSource
      .getRepository(ExerciseEntity)
      .findOne({ where: { id } });
    if (!exercise) {
      throw new Error('Упражнение не найдено');
    }
    Object.assign(exercise, dto);
    const updatedExercise = await dataSource
      .getRepository(ExerciseEntity)
      .save(exercise);
    return this.mapExerciseToDto(updatedExercise);
  }

  async deleteExercise(id: number): Promise<void> {
    const result = await dataSource.getRepository(ExerciseEntity).delete(id);
    if (result.affected === 0) {
      throw new Error('Упражнение не найдено');
    }
  }

  async getExercisesByWeaponType(weaponTypeId: number): Promise<ExerciseDto[]> {
    const exercises = await dataSource.getRepository(ExerciseEntity).find({
      where: { weaponTypeId },
    });
    return exercises.map(exercise => this.mapExerciseToDto(exercise));
  }

  private mapExerciseToDto(exercise: ExerciseEntity): ExerciseDto {
    return {
      id: exercise.id,
      name: exercise.name,
      description: exercise.description || '',
      weaponTypeId: exercise.weaponTypeId,
      targetId: exercise.targetId,
      createdAt: exercise.createdAt.toISOString(),
      updatedAt: exercise.updatedAt.toISOString(),
    };
  }

  // Цели
  async getAllTargets(): Promise<TargetDto[]> {
    const targets = await dataSource.getRepository(TargetEntity).find();
    return targets.map(target => this.mapTargetToDto(target));
  }

  async getTargetById(id: number): Promise<TargetDto> {
    const target = await dataSource
      .getRepository(TargetEntity)
      .findOne({ where: { id } });
    if (!target) {
      throw new Error('Мишень не найдена');
    }
    return this.mapTargetToDto(target);
  }

  async createTarget(dto: CreateTargetDto): Promise<TargetDto> {
    const target = dataSource.getRepository(TargetEntity).create(dto);
    const savedTarget = await dataSource
      .getRepository(TargetEntity)
      .save(target);
    return this.mapTargetToDto(savedTarget);
  }

  async updateTarget(id: number, dto: UpdateTargetDto): Promise<TargetDto> {
    const target = await dataSource
      .getRepository(TargetEntity)
      .findOne({ where: { id } });
    if (!target) {
      throw new Error('Мишень не найдена');
    }
    Object.assign(target, dto);
    const updatedTarget = await dataSource
      .getRepository(TargetEntity)
      .save(target);
    return this.mapTargetToDto(updatedTarget);
  }

  async deleteTarget(id: number): Promise<void> {
    const result = await dataSource.getRepository(TargetEntity).delete(id);
    if (result.affected === 0) {
      throw new Error('Мишень не найдена');
    }
  }

  private mapTargetToDto(target: TargetEntity): TargetDto {
    return {
      id: target.id,
      name: target.name,
      description: target.description || '',
      createdAt: target.createdAt.toISOString(),
      updatedAt: target.updatedAt.toISOString(),
    };
  }

  // Типы оружия
  async getAllWeaponTypes(): Promise<WeaponTypeDto[]> {
    const weaponTypes = await dataSource.getRepository(WeaponTypeEntity).find();
    return weaponTypes.map(weaponType => this.mapWeaponTypeToDto(weaponType));
  }

  async getWeaponTypeById(id: number): Promise<WeaponTypeDto> {
    const weaponType = await dataSource
      .getRepository(WeaponTypeEntity)
      .findOne({ where: { id } });
    if (!weaponType) {
      throw new Error('Тип оружия не найден');
    }
    return this.mapWeaponTypeToDto(weaponType);
  }

  async createWeaponType(dto: CreateWeaponTypeDto): Promise<WeaponTypeDto> {
    const weaponType = dataSource.getRepository(WeaponTypeEntity).create(dto);
    const savedWeaponType = await dataSource
      .getRepository(WeaponTypeEntity)
      .save(weaponType);
    return this.mapWeaponTypeToDto(savedWeaponType);
  }

  async updateWeaponType(
    id: number,
    dto: UpdateWeaponTypeDto,
  ): Promise<WeaponTypeDto> {
    const weaponType = await dataSource
      .getRepository(WeaponTypeEntity)
      .findOne({ where: { id } });
    if (!weaponType) {
      throw new Error('Тип оружия не найден');
    }
    Object.assign(weaponType, dto);
    const updatedWeaponType = await dataSource
      .getRepository(WeaponTypeEntity)
      .save(weaponType);
    return this.mapWeaponTypeToDto(updatedWeaponType);
  }

  async deleteWeaponType(id: number): Promise<void> {
    const result = await dataSource.getRepository(WeaponTypeEntity).delete(id);
    if (result.affected === 0) {
      throw new Error('Тип оружия не найден');
    }
  }

  private mapWeaponTypeToDto(weaponType: WeaponTypeEntity): WeaponTypeDto {
    return {
      id: weaponType.id,
      name: weaponType.name,
      description: weaponType.description || '',
      createdAt: weaponType.createdAt.toISOString(),
      updatedAt: weaponType.updatedAt.toISOString(),
    };
  }

  async isReferenceUsed(referenceId: number): Promise<boolean> {
    try {
      const response = await fetch(
        `http://training-service:3000/api/trainings/reference/${referenceId}`,
      );
      if (response.ok) {
        const data = (await response.json()) as any[];
        return data.length > 0;
      }
      return false;
    } catch (error) {
      console.error('Ошибка при проверке использования справочника:', error);
      return false;
    }
  }
}
