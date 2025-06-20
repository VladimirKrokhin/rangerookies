import { Repository } from 'typeorm';
import { SeriesEntity } from '../models/series.entity';
import { ShotEntity } from '../models/shot.entity';
import {
  SeriesDto,
  CreateSeriesDto,
  UpdateSeriesDto,
  ShotDto,
  TrainingType,
} from '@app/dto';
import { Service } from 'typedi';
import { dataSource } from '../config/database';

@Service()
export class SeriesService {
  private seriesRepository: Repository<SeriesEntity>;
  private shotRepository: Repository<ShotEntity>;

  constructor() {
    this.seriesRepository = dataSource.getRepository(SeriesEntity);
    this.shotRepository = dataSource.getRepository(ShotEntity);
  }

  async getAllSeries(): Promise<SeriesDto[]> {
    const series = await this.seriesRepository.find({
      relations: ['shots'],
    });
    return series.map(series => this.mapToDto(series));
  }

  async getSeriesById(id: number): Promise<SeriesDto> {
    const series = await this.seriesRepository.findOne({
      where: { id },
      relations: ['shots'],
    });
    if (!series) {
      throw new Error('Серия не найдена');
    }
    return this.mapToDto(series);
  }

  async createSeries(dto: CreateSeriesDto): Promise<SeriesDto> {
    const series = this.seriesRepository.create({
      trainingId: dto.trainingId,
      type: dto.type,
      order: dto.order,
    });
    const savedSeries = await this.seriesRepository.save(series);
    return this.mapToDto(savedSeries);
  }

  async createSeriesForTraining(
    trainingId: number,
    dto: CreateSeriesDto,
  ): Promise<SeriesDto> {
    const series = this.seriesRepository.create({
      trainingId,
      order: dto.order,
    });
    const savedSeries = await this.seriesRepository.save(series);
    return this.mapToDto(savedSeries);
  }

  async updateSeries(id: number, dto: UpdateSeriesDto): Promise<SeriesDto> {
    const series = await this.seriesRepository.findOne({
      where: { id },
      relations: ['shots'],
    });
    if (!series) {
      throw new Error('Серия не найдена');
    }

    if (dto.type) {
      series.type = dto.type;
    }
    if (dto.order) {
      series.order = dto.order;
    }

    const updatedSeries = await this.seriesRepository.save(series);
    return this.mapToDto(updatedSeries);
  }

  async deleteSeries(id: number): Promise<void> {
    const series = await this.seriesRepository.findOne({
      where: { id },
      relations: ['shots'],
    });
    if (!series) {
      throw new Error('Серия не найдена');
    }

    // Delete all shots
    await this.shotRepository.remove(series.shots);

    // Delete series
    await this.seriesRepository.remove(series);
  }

  async getSeriesByTrainingId(trainingId: number): Promise<SeriesDto[]> {
    const series = await this.seriesRepository.find({
      where: { trainingId },
      relations: ['shots'],
    });
    return series.map(series => this.mapToDto(series));
  }

  private mapToDto(series: SeriesEntity): SeriesDto {
    return {
      id: series.id,
      trainingId: series.trainingId,
      type: series.type,
      order: series.order,
      shots:
        series.shots?.map(shot => ({
          id: shot.id,
          seriesId: shot.seriesId,
          order: shot.order,
          score: shot.score,
          x: shot.x,
          y: shot.y,
          createdAt: shot.createdAt,
          updatedAt: shot.updatedAt,
        })) || [],
      createdAt: series.createdAt,
      updatedAt: series.updatedAt,
    };
  }
}
