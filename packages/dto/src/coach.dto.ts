import { IsNumber, IsOptional, IsArray } from 'class-validator';

export class CoachDto {
  @IsNumber()
  id!: number;

  @IsNumber()
  userId!: number;

  @IsArray()
  @IsNumber({}, { each: true })
  athleteIds!: number[];

  createdAt!: string;

  updatedAt!: string;
}

export class CreateCoachDto {
  @IsNumber()
  userId!: number;


  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  athleteIds?: number[];
}

export class UpdateCoachDto {
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  athleteIds?: number[];
}
