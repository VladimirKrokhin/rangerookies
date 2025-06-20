import { IsString, IsNumber, IsOptional } from 'class-validator';

export class NoteDto {
  id!: number;
  userId!: number;
  content!: string;
  trainingId?: number;
  seriesId?: number;
  shotId?: number;
  createdAt!: string;
  updatedAt!: string;
}

export class CreateNoteDto {
  @IsNumber()
  userId!: number;

  @IsString()
  content!: string;

  @IsNumber()
  @IsOptional()
  trainingId?: number;

  @IsNumber()
  @IsOptional()
  seriesId?: number;

  @IsNumber()
  @IsOptional()
  shotId?: number;
}

export class UpdateNoteDto {
  @IsString()
  @IsOptional()
  content?: string;
}

export class TrainingNoteDto extends NoteDto {
  trainingId!: number;
  noteId!: number;
}

export class SeriesNoteDto extends NoteDto {
  seriesId!: number;
  noteId!: number;
}

export class ShotNoteDto extends NoteDto {
  shotId!: number;
}

export class CreateTrainingNoteDto extends CreateNoteDto {
  trainingId!: number;
}

export class CreateSeriesNoteDto extends CreateNoteDto {
  seriesId!: number;
}

export class CreateShotNoteDto extends CreateNoteDto {
  shotId!: number;
}
