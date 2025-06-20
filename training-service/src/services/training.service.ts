import { Repository } from 'typeorm';
import { TrainingEntity } from '../models/training.entity';
import { FreeTrainingEntity } from '../models/free-training.entity';
import { QualificationTrainingEntity } from '../models/qualification-training.entity';
import { SeriesEntity } from '../models/series.entity';
import { ShotEntity } from '../models/shot.entity';
import {
  TrainingDto,
  CreateTrainingDto,
  UpdateTrainingDto,
  FreeTrainingDto,
  CreateFreeTrainingDto,
  UpdateFreeTrainingDto,
  QualificationTrainingDto,
  CreateQualificationTrainingDto,
  UpdateQualificationTrainingDto,
  SeriesDto,
  CreateSeriesDto,
  UpdateSeriesDto,
  ShotDto,
  CreateShotDto,
  UpdateShotDto,
  TrainingType,
} from '@app/dto';
import { Service } from 'typedi';

@Service()
export class TrainingService {
  constructor(
    private readonly trainingRepository: Repository<TrainingEntity>,
    private readonly seriesRepository: Repository<SeriesEntity>,
    private readonly shotRepository: Repository<ShotEntity>,
    private readonly freeTrainingRepository: Repository<FreeTrainingEntity>,
    private readonly qualificationTrainingRepository: Repository<QualificationTrainingEntity>,
  ) {}

  async getAllTrainings(): Promise<TrainingDto[]> {
    const trainings = await this.trainingRepository.find({
      relations: ['series'],
    });
    return trainings.map(training => this.mapToDto(training));
  }

  async getTrainingById(id: number): Promise<TrainingDto> {
    const training = await this.trainingRepository.findOne({
      where: { id },
      relations: ['series'],
    });
    if (!training) {
      throw new Error('Тренировка не найдена');
    }
    return this.mapToDto(training);
  }

  async createTraining(dto: CreateTrainingDto): Promise<TrainingDto> {
    const training = this.trainingRepository.create(dto);
    await this.trainingRepository.save(training);
    return this.mapToDto(training);
  }

  async createFreeTraining(
    dto: CreateFreeTrainingDto,
  ): Promise<FreeTrainingDto> {
    // Сначала создаем базовую тренировку
    const training = this.trainingRepository.create({
      type: TrainingType.FREE,
      athleteId: dto.athleteId,
    });
    const savedTraining = await this.trainingRepository.save(training);

    // Затем создаем свободную тренировку с ссылкой на базовую тренировку
    const freeTraining = this.freeTrainingRepository.create({
      training_id: savedTraining.id,
      weapon_type_id: dto.weaponTypeId,
      target_id: dto.targetId,
    });
    const savedFreeTraining =
      await this.freeTrainingRepository.save(freeTraining);

    // Загружаем полную сущность с связями
    const fullFreeTraining = await this.freeTrainingRepository.findOne({
      where: { id: savedFreeTraining.id },
      relations: ['training', 'training.series', 'training.series.shots'],
    });

    if (!fullFreeTraining) {
      throw new Error('Не удалось создать свободную тренировку');
    }

    return this.mapToFreeTrainingDto(fullFreeTraining);
  }

  async createQualificationTraining(
    dto: CreateQualificationTrainingDto,
  ): Promise<QualificationTrainingDto> {
    // Сначала создаем базовую тренировку
    const training = this.trainingRepository.create({
      type: TrainingType.QUALIFICATION,
      athleteId: dto.athleteId,
    });
    const savedTraining = await this.trainingRepository.save(training);

    // Затем создаем квалификационную тренировку с ссылкой на базовую тренировку
    const qualificationTraining = this.qualificationTrainingRepository.create({
      training_id: savedTraining.id,
      exercise_id: dto.exerciseId,
    });
    const savedQualificationTraining =
      await this.qualificationTrainingRepository.save(qualificationTraining);

    // Загружаем полную сущность с связями
    const fullQualificationTraining =
      await this.qualificationTrainingRepository.findOne({
        where: { id: savedQualificationTraining.id },
        relations: ['training', 'training.series', 'training.series.shots'],
      });

    if (!fullQualificationTraining) {
      throw new Error('Не удалось создать квалификационную тренировку');
    }

    return this.mapToQualificationDto(fullQualificationTraining);
  }

  async updateTraining(
    id: number,
    dto: UpdateTrainingDto,
  ): Promise<TrainingDto> {
    const training = await this.trainingRepository.findOne({ where: { id } });
    if (!training) {
      throw new Error('Тренировка не найдена');
    }
    Object.assign(training, dto);
    await this.trainingRepository.save(training);
    return this.mapToDto(training);
  }

  async updateFreeTraining(
    id: number,
    dto: UpdateFreeTrainingDto,
  ): Promise<FreeTrainingDto> {
    const freeTraining = await this.freeTrainingRepository.findOne({
      where: { id },
      relations: ['training', 'training.series', 'training.series.shots'],
    });
    if (!freeTraining) {
      throw new Error('Тренировка не найдена');
    }
    if (dto.weaponTypeId) {
      freeTraining.weapon_type_id = dto.weaponTypeId;
    }
    if (dto.targetId) {
      freeTraining.target_id = dto.targetId;
    }
    if (dto.athleteId) {
      freeTraining.training.athleteId = dto.athleteId;
    }
    await this.freeTrainingRepository.save(freeTraining);
    await this.trainingRepository.save(freeTraining.training);
    return this.mapToFreeTrainingDto(freeTraining);
  }

  async updateQualificationTraining(
    id: number,
    dto: UpdateQualificationTrainingDto,
  ): Promise<QualificationTrainingDto> {
    const qualificationTraining =
      await this.qualificationTrainingRepository.findOne({
        where: { id },
        relations: ['training', 'training.series', 'training.series.shots'],
      });
    if (!qualificationTraining) {
      throw new Error('Тренировка не найдена');
    }

    if (dto.exerciseId) {
      qualificationTraining.exercise_id = dto.exerciseId;
    }
    if (dto.athleteId) {
      qualificationTraining.training.athleteId = dto.athleteId;
    }

    await this.qualificationTrainingRepository.save(qualificationTraining);
    await this.trainingRepository.save(qualificationTraining.training);
    return this.mapToQualificationDto(qualificationTraining);
  }

  async deleteTraining(id: number): Promise<void> {
    const result = await this.freeTrainingRepository.delete(id);
    if (result.affected === 0) {
      throw new Error('Тренировка не найдена');
    }
  }

  async addSeriesToTraining(
    trainingId: number,
    createSeriesDto: CreateSeriesDto,
  ): Promise<SeriesDto> {
    const training = await this.trainingRepository.findOne({
      where: { id: trainingId },
    });
    if (!training) {
      throw new Error(`Тренировка с id ${trainingId} не найдена`);
    }

    const series = this.seriesRepository.create({
      trainingId,
      order: createSeriesDto.order,
    });
    const savedSeries = await this.seriesRepository.save(series);
    return this.mapSeriesToDto(savedSeries);
  }

  async updateSeries(
    id: number,
    updateSeriesDto: UpdateSeriesDto,
  ): Promise<SeriesDto> {
    const series = await this.seriesRepository.findOne({
      where: { id },
      relations: ['shots'],
    });
    if (!series) {
      throw new Error(`Серия с id ${id} не найдена`);
    }

    if (updateSeriesDto.order !== undefined) {
      series.order = updateSeriesDto.order;
    }

    const updatedSeries = await this.seriesRepository.save(series);
    return this.mapSeriesToDto(updatedSeries);
  }

  async deleteSeries(id: number): Promise<void> {
    const series = await this.seriesRepository.findOne({
      where: { id },
      relations: ['shots'],
    });
    if (!series) {
      throw new Error(`Серия с id ${id} не найдена`);
    }

    // Delete all shots
    for (const shot of series.shots) {
      await this.shotRepository.remove(shot);
    }

    // Delete series
    await this.seriesRepository.remove(series);
  }

  async getSeriesByTrainingId(trainingId: number): Promise<SeriesDto[]> {
    const series = await this.seriesRepository.find({
      where: { trainingId },
      relations: ['shots'],
    });
    return series.map(this.mapSeriesToDto);
  }

  async createShot(createShotDto: CreateShotDto): Promise<ShotDto> {
    const shot = this.shotRepository.create({
      seriesId: createShotDto.seriesId,
      order: createShotDto.order,
      score: createShotDto.score,
      x: createShotDto.x,
      y: createShotDto.y,
    });
    const savedShot = await this.shotRepository.save(shot);
    return this.mapShotToDto(savedShot);
  }

  async updateShot(id: number, updateShotDto: UpdateShotDto): Promise<ShotDto> {
    const shot = await this.shotRepository.findOne({
      where: { id },
    });
    if (!shot) {
      throw new Error(`Выстрел с id ${id} не найден`);
    }

    if (updateShotDto.order !== undefined) {
      shot.order = updateShotDto.order;
    }
    if (updateShotDto.score !== undefined) {
      shot.score = updateShotDto.score;
    }
    if (updateShotDto.x !== undefined) {
      shot.x = updateShotDto.x;
    }
    if (updateShotDto.y !== undefined) {
      shot.y = updateShotDto.y;
    }

    const updatedShot = await this.shotRepository.save(shot);
    return this.mapShotToDto(updatedShot);
  }

  async deleteShot(id: number): Promise<void> {
    const shot = await this.shotRepository.findOne({
      where: { id },
    });
    if (!shot) {
      throw new Error(`Выстрел с id ${id} не найден`);
    }
    await this.shotRepository.remove(shot);
  }

  async getShotsBySeriesId(seriesId: number): Promise<ShotDto[]> {
    const shots = await this.shotRepository.find({
      where: { seriesId },
    });
    return shots.map(shot => this.mapShotToDto(shot));
  }

  private mapToDto(training: TrainingEntity): TrainingDto {
    return {
      id: training.id,
      type: training.type,
      athleteId: training.athleteId,
      series: training.series.map(series => ({
        id: series.id,
        trainingId: series.trainingId,
        type: series.type,
        order: series.order,
        shots: series.shots.map(shot => ({
          id: shot.id,
          seriesId: shot.seriesId,
          order: shot.order,
          score: shot.score,
          x: shot.x,
          y: shot.y,
          createdAt: shot.createdAt,
          updatedAt: shot.updatedAt,
        })),
        createdAt: series.createdAt,
        updatedAt: series.updatedAt,
      })),
      createdAt: training.createdAt,
      updatedAt: training.updatedAt,
    };
  }

  private mapToFreeTrainingDto(
    freeTraining: FreeTrainingEntity,
  ): FreeTrainingDto {
    return {
      id: freeTraining.id,
      trainingId: freeTraining.training.id,
      type: freeTraining.training.type,
      athleteId: freeTraining.training.athleteId,
      weaponTypeId: freeTraining.weapon_type_id,
      targetId: freeTraining.target_id,
      series:
        freeTraining.training.series?.map(series =>
          this.mapSeriesToDto(series),
        ) || [],
      createdAt: freeTraining.training.createdAt,
      updatedAt: freeTraining.training.updatedAt,
    };
  }

  private mapToQualificationDto(
    qualificationTraining: QualificationTrainingEntity,
  ): QualificationTrainingDto {
    return {
      id: qualificationTraining.id,
      trainingId: qualificationTraining.training.id,
      type: qualificationTraining.training.type,
      athleteId: qualificationTraining.training.athleteId,
      exerciseId: qualificationTraining.exercise_id,
      series:
        qualificationTraining.training.series?.map(series =>
          this.mapSeriesToDto(series),
        ) || [],
      createdAt: qualificationTraining.training.createdAt,
      updatedAt: qualificationTraining.training.updatedAt,
    };
  }

  private mapSeriesToDto(series: SeriesEntity): SeriesDto {
    return {
      id: series.id,
      trainingId: series.trainingId,
      type: series.type,
      order: series.order,
      shots: series.shots?.map(this.mapShotToDto) || [],
      createdAt: series.createdAt,
      updatedAt: series.updatedAt,
    };
  }

  private mapShotToDto(shot: ShotEntity): ShotDto {
    return {
      id: shot.id,
      seriesId: shot.seriesId,
      order: shot.order,
      score: shot.score,
      x: shot.x,
      y: shot.y,
      createdAt: shot.createdAt,
      updatedAt: shot.updatedAt,
    };
  }

  /**
   * Получить все квалификационные тренировки
   * @returns Массив квалификационных тренировок
   */
  async getAllQualificationTrainings(): Promise<QualificationTrainingDto[]> {
    const qualificationTrainings =
      await this.qualificationTrainingRepository.find({
        relations: ['training', 'training.series', 'training.series.shots'],
      });
    return qualificationTrainings.map(this.mapToQualificationDto.bind(this));
  }

  /**
   * Получить квалификационную тренировку по ID
   * @param id ID тренировки
   * @returns Данные тренировки
   */
  async getQualificationTrainingById(
    id: number,
  ): Promise<QualificationTrainingDto> {
    const qualificationTraining =
      await this.qualificationTrainingRepository.findOne({
        where: { id },
        relations: ['training', 'training.series', 'training.series.shots'],
      });
    if (!qualificationTraining) {
      throw new Error('Квалификационная тренировка не найдена');
    }
    return this.mapToQualificationDto(qualificationTraining);
  }

  /**
   * Удалить квалификационную тренировку
   * @param id ID тренировки
   */
  async deleteQualificationTraining(id: number): Promise<void> {
    const qualificationTraining =
      await this.qualificationTrainingRepository.findOne({
        where: { id },
        relations: ['training'],
      });
    if (!qualificationTraining) {
      throw new Error('Квалификационная тренировка не найдена');
    }

    // Удаляем квалификационную тренировку
    await this.qualificationTrainingRepository.remove(qualificationTraining);
    // Удаляем базовую тренировку
    await this.trainingRepository.remove(qualificationTraining.training);
  }

  /**
   * Получить квалификационные тренировки спортсмена
   * @param athleteId ID спортсмена
   * @returns Массив тренировок
   */
  async getQualificationTrainingsByAthleteId(
    athleteId: number,
  ): Promise<QualificationTrainingDto[]> {
    const qualificationTrainings =
      await this.qualificationTrainingRepository.find({
        relations: ['training', 'training.series', 'training.series.shots'],
        where: {
          training: {
            athleteId,
          },
        },
      });
    return qualificationTrainings.map(this.mapToQualificationDto.bind(this));
  }

  /**
   * Получить все свободные тренировки
   * @returns Массив свободных тренировок
   */
  async getAllFreeTrainings(): Promise<FreeTrainingDto[]> {
    const freeTrainings = await this.freeTrainingRepository.find({
      relations: ['training', 'training.series', 'training.series.shots'],
    });
    return freeTrainings.map(this.mapToFreeTrainingDto.bind(this));
  }

  /**
   * Получить свободную тренировку по ID
   * @param id ID тренировки
   * @returns Данные тренировки
   */
  async getFreeTrainingById(id: number): Promise<FreeTrainingDto> {
    const freeTraining = await this.freeTrainingRepository.findOne({
      where: { id },
      relations: ['training', 'training.series', 'training.series.shots'],
    });
    if (!freeTraining) {
      throw new Error('Свободная тренировка не найдена');
    }
    return this.mapToFreeTrainingDto(freeTraining);
  }

  async getFreeTrainingsByAthleteId(
    athleteId: number,
  ): Promise<FreeTrainingDto[]> {
    const freeTrainings = await this.freeTrainingRepository.find({
      relations: ['training', 'training.series', 'training.series.shots'],
      where: {
        training: {
          athleteId,
        },
      },
    });
    return freeTrainings.map(this.mapToFreeTrainingDto.bind(this));
  }

  async addSeriesToQualificationTraining(
    dto: CreateSeriesDto,
  ): Promise<SeriesDto> {
    const training = await this.trainingRepository.findOne({
      where: { id: dto.trainingId, type: TrainingType.QUALIFICATION },
      relations: ['series'],
    });
    if (!training) {
      throw new Error('Тренировка не найдена');
    }
    // Добавляем новую серию к тренировке
    const newSeries = this.seriesRepository.create({
      ...dto,
      trainingId: dto.trainingId,
    });
    await this.seriesRepository.save(newSeries);
    // Обновляем список серий у тренировки
    training.series = [...(training.series || []), newSeries];
    await this.trainingRepository.save(training);
    return this.mapSeriesToDto(newSeries);
  }
}
