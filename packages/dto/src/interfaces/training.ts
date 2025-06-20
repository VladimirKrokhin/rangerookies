import {
  CreateFreeTrainingDto,
  FreeTrainingDto,
  UpdateFreeTrainingDto,
  CreateQualificationTrainingDto,
  QualificationTrainingDto,
  UpdateQualificationTrainingDto,
} from '../training.dto';
import { CreateSeriesDto, SeriesDto, UpdateSeriesDto } from '../series.dto';
import { CreateShotDto, ShotDto, UpdateShotDto } from '../shot.dto';

/**
 * Интерфейс сервиса тренировок
 */
export interface ITrainingService {
  /**
   * Получить все тренировки
   */
  getAllTrainings(): Promise<(QualificationTrainingDto | FreeTrainingDto)[]>;

  /**
   * Получить все свободные тренировки
   */
  getAllFreeTrainings(): Promise<FreeTrainingDto[]>;

  /**
   * Получить свободную тренировку по ID
   * @param id ID тренировки
   */
  getFreeTrainingById(id: number): Promise<FreeTrainingDto>;

  /**
   * Создать новую свободную тренировку
   * @param trainingData Данные тренировки
   */
  createFreeTraining(
    trainingData: CreateFreeTrainingDto,
  ): Promise<FreeTrainingDto>;

  /**
   * Обновить свободную тренировку
   * @param id ID тренировки
   * @param trainingData Новые данные тренировки
   */
  updateFreeTraining(
    id: number,
    trainingData: UpdateFreeTrainingDto,
  ): Promise<FreeTrainingDto>;

  /**
   * Удалить свободную тренировку
   * @param id ID тренировки
   */
  deleteFreeTraining(id: number): Promise<void>;

  /**
   * Получить все квалификационные тренировки
   */
  getAllQualificationTrainings(): Promise<QualificationTrainingDto[]>;

  /**
   * Получить квалификационную тренировку по ID
   * @param id ID тренировки
   */
  getQualificationTrainingById(id: number): Promise<QualificationTrainingDto>;

  /**
   * Создать новую квалификационную тренировку
   * @param trainingData Данные тренировки
   */
  createQualificationTraining(
    trainingData: CreateQualificationTrainingDto,
  ): Promise<QualificationTrainingDto>;

  /**
   * Обновить квалификационную тренировку
   * @param id ID тренировки
   * @param trainingData Новые данные тренировки
   */
  updateQualificationTraining(
    id: number,
    trainingData: UpdateQualificationTrainingDto,
  ): Promise<QualificationTrainingDto>;

  /**
   * Удалить квалификационную тренировку
   * @param id ID тренировки
   */
  deleteQualificationTraining(id: number): Promise<void>;

  /**
   * Получить все серии для тренировки
   * @param trainingId ID тренировки
   */
  getSeriesByTrainingId(
    trainingId: number,
    training_type: 'qualification' | 'free',
  ): Promise<SeriesDto[]>;

  /**
   * Получить серию по ID
   * @param id ID серии
   */
  getSeriesById(id: number): Promise<SeriesDto>;

  /**
   * Создать новую серию для свободной тренировки
   * @param training_id ID свободной тренировки
   * @param seriesData Данные серии
   */
  addSeriesToFreeTraining(
    training_id: number,
    seriesData: CreateSeriesDto,
  ): Promise<SeriesDto>;

  /**
   * Создать новую серию
   * @param seriesData Данные серии
   */
  addSeriesToQualificationTraining(
    seriesData: CreateSeriesDto,
  ): Promise<SeriesDto>;

  /**
   * Обновить серию
   * @param id ID серии
   * @param seriesData Новые данные серии
   */
  updateSeries(id: number, seriesData: UpdateSeriesDto): Promise<SeriesDto>;

  /**
   * Удалить серию
   * @param id ID серии
   */
  deleteSeries(id: number): Promise<void>;

  /**
   * Получить все выстрелы для серии
   * @param seriesId ID серии
   */
  getShotsBySeriesId(seriesId: number): Promise<ShotDto[]>;

  /**
   * Получить выстрел по ID
   * @param id ID выстрела
   */
  getShotById(id: number): Promise<ShotDto>;

  /**
   * Создать новый выстрел
   * @param shotData Данные выстрела
   */
  createShot(shotData: CreateShotDto): Promise<ShotDto>;

  /**
   * Обновить выстрел
   * @param id ID выстрела
   * @param shotData Новые данные выстрела
   */
  updateShot(id: number, shotData: UpdateShotDto): Promise<ShotDto>;

  /**
   * Удалить выстрел
   * @param id ID выстрела
   */
  deleteShot(id: number): Promise<void>;

  /**
   * Получить свободные тренировки по ID спортсмена
   * @param athleteId ID спортсмена
   */
  getFreeTrainingsByAthleteId(athleteId: number): Promise<FreeTrainingDto[]>;

  /**
   * Получить квалификационные тренировки по ID спортсмена
   * @param athleteId ID спортсмена
   */
  getQualificationTrainingsByAthleteId(
    athleteId: number,
  ): Promise<QualificationTrainingDto[]>;
}
