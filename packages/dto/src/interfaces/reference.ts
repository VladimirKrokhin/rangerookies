import {
  ExerciseDto,
  CreateExerciseDto,
  UpdateExerciseDto,
  TargetDto,
  CreateTargetDto,
  UpdateTargetDto,
  WeaponTypeDto,
  CreateWeaponTypeDto,
  UpdateWeaponTypeDto,
} from '../reference.dto';

export {
  ExerciseDto,
  CreateExerciseDto,
  UpdateExerciseDto,
  TargetDto,
  CreateTargetDto,
  UpdateTargetDto,
  WeaponTypeDto,
  CreateWeaponTypeDto,
  UpdateWeaponTypeDto,
};

/**
 * Интерфейс сервиса справочников
 */
export interface IReferenceService {
  /**
   * Получить все справочники
   */
  getAllReferences(): Promise<Record<string, any[]>>;

  /**
   * Получить справочник по имени
   * @param name Имя справочника
   */
  getReferenceByName(name: string): Promise<any[]>;

  /**
   * Обновить справочник
   * @param name Имя справочника
   * @param data Новые данные справочника
   */
  updateReference(name: string, data: any[]): Promise<any[]>;
}
