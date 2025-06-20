import { IsNumber, IsOptional, IsArray } from 'class-validator';

export class AthleteDto {
  @IsNumber()
  id!: number;

  @IsNumber()
  userId!: number;

  @IsArray()
  @IsNumber({}, { each: true })
  coachIds!: number[];

  createdAt!: string;

  updatedAt!: string;
}

export class CreateAthleteDto {
  @IsNumber()
  userId!: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  coachIds?: number[];
}

export class UpdateAthleteDto {
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  coachIds?: number[];
}
