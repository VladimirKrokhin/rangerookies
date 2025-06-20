import { IsInt, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { OpenAPI } from 'routing-controllers-openapi';

@OpenAPI({})
export class ShotDto {
  @IsInt()
  id!: number;

  @IsInt()
  seriesId!: number;

  @IsNumber()
  order!: number;

  @IsNumber()
  score!: number;

  @IsNumber()
  x!: number;

  @IsNumber()
  y!: number;

  @IsDateString()
  createdAt!: Date;

  @IsDateString()
  updatedAt!: Date;
}

@OpenAPI({})
export class CreateShotDto {
  @IsInt()
  seriesId!: number;

  @IsNumber()
  order!: number;

  @IsNumber()
  score!: number;

  @IsNumber()
  x!: number;

  @IsNumber()
  y!: number;
}

@OpenAPI({})
export class UpdateShotDto {
  @IsOptional()
  @IsNumber()
  order?: number;

  @IsOptional()
  @IsNumber()
  score?: number;

  @IsOptional()
  @IsNumber()
  x?: number;

  @IsOptional()
  @IsNumber()
  y?: number;
}
