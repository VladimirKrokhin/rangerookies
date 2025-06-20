import {
  IsNumber,
  IsEnum,
  IsArray,
  ValidateNested,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ShotDto } from './shot.dto';
import { TrainingType } from './enums';
import { OpenAPI } from 'routing-controllers-openapi';

@OpenAPI({})
export class SeriesDto {
  @IsNumber()
  id!: number;

  @IsNumber()
  trainingId!: number;

  @IsEnum(TrainingType)
  type!: TrainingType;

  @IsNumber()
  order!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShotDto)
  shots!: ShotDto[];

  @IsDateString()
  createdAt!: Date;

  @IsDateString()
  updatedAt!: Date;
}

@OpenAPI({})
export class CreateSeriesDto {
  @IsNumber()
  trainingId!: number;

  @IsEnum(TrainingType)
  type!: TrainingType;

  @IsNumber()
  order!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShotDto)
  @IsOptional()
  shots?: ShotDto[];
}

@OpenAPI({})
export class UpdateSeriesDto {
  @IsEnum(TrainingType)
  @IsOptional()
  type?: TrainingType;

  @IsNumber()
  @IsOptional()
  order?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShotDto)
  @IsOptional()
  shots?: ShotDto[];
}
