import { IsString, IsNumber, IsOptional } from 'class-validator';

export class TargetDto {
  id!: number;
  name!: string;
  description!: string;
  createdAt!: string;
  updatedAt!: string;
}

export class CreateTargetDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateTargetDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class WeaponTypeDto {
  id!: number;
  name!: string;
  description!: string;
  createdAt!: string;
  updatedAt!: string;
}

export class CreateWeaponTypeDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateWeaponTypeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class ExerciseDto {
  @IsNumber()
  id!: number;

  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsNumber()
  targetId!: number;

  @IsNumber()
  weaponTypeId!: number;

  createdAt!: string;

  updatedAt!: string;
}

export class CreateExerciseDto {
  @IsString()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  targetId!: number;

  @IsNumber()
  weaponTypeId!: number;
}

export class UpdateExerciseDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  targetId?: number;

  @IsNumber()
  @IsOptional()
  weaponTypeId?: number;
}
