import {
  Body,
  Delete,
  Get,
  JsonController,
  OnUndefined,
  Param,
  Patch,
  Post,
  UseBefore,
  NotFoundError,
  BadRequestError,
  Req,
  Authorized,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { TrainingService } from '../services/training.service';
import { CreateSeriesDto, SeriesDto, UpdateSeriesDto } from '@app/dto';
import authMiddleware from '../middlewares/auth.middleware';
import { SeriesService } from '../services/series.service';
import { Service } from 'typedi';
import { dataSource } from '../config/database';
import { TrainingEntity } from '../models/training.entity';
import { SeriesEntity } from '../models/series.entity';
import { ShotEntity } from '../models/shot.entity';
import { FreeTrainingEntity } from '../models/free-training.entity';
import { QualificationTrainingEntity } from '../models/qualification-training.entity';

@JsonController('/training/series')
@Service()
export class SeriesController {
  private seriesService: SeriesService;
  private trainingService: TrainingService;

  constructor() {
    this.seriesService = new SeriesService();
    this.trainingService = new TrainingService(
      dataSource.getRepository(TrainingEntity),
      dataSource.getRepository(SeriesEntity),
      dataSource.getRepository(ShotEntity),
      dataSource.getRepository(FreeTrainingEntity),
      dataSource.getRepository(QualificationTrainingEntity),
    );
  }

  /**
   * Получить все серии
   * @returns Список всех серий
   */
  @Get('/')
  @OpenAPI({ summary: 'Получить все серии' })
  @ResponseSchema(SeriesDto, { isArray: true })
  async getAllSeries(): Promise<SeriesDto[]> {
    return this.seriesService.getAllSeries();
  }

  /**
   * Получить серию по ID
   * @param id ID серии
   * @returns Данные серии
   */
  @Get('/:id')
  @OpenAPI({ summary: 'Получить серию по id' })
  @ResponseSchema(SeriesDto)
  async getSeriesById(@Param('id') id: number): Promise<SeriesDto> {
    return this.seriesService.getSeriesById(id);
  }

  /**
   * Создать серию
   * @param dto Данные для создания серии
   * @returns Созданная серия
   */
  @Post('/')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Создать серию' })
  @ResponseSchema(SeriesDto)
  async createSeries(@Body() dto: CreateSeriesDto): Promise<SeriesDto> {
    return this.seriesService.createSeries(dto);
  }

  /**
   * Создать серию для свободной тренировки
   * @param trainingId ID свободной тренировки
   * @param dto Данные для создания серии
   * @returns Созданная серия
   */
  @Post('/training/:trainingId')
  @Authorized()
  @OpenAPI({
    summary: 'Создать серию для тренировки',
    responses: {
      '201': {
        description: 'Серия создана',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/SeriesDto' },
          },
        },
      },
    },
  })
  @ResponseSchema(SeriesDto)
  async createSeriesForTraining(
    @Param('trainingId') trainingId: number,
    @Body() dto: CreateSeriesDto,
  ): Promise<SeriesDto> {
    const training = await this.trainingService.getTrainingById(trainingId);
    if (!training) {
      throw new NotFoundError(`Training with id ${trainingId} not found`);
    }
    return this.seriesService.createSeriesForTraining(trainingId, dto);
  }

  /**
   * Создать серию для квалификационной тренировки
   * @param dto Данные для создания серии (должен содержать trainingId)
   * @returns Созданная серия
   */
  @Post('/qualification')
  @Authorized()
  @OpenAPI({ summary: 'Создать серию для квалификационной тренировки' })
  @ResponseSchema(SeriesDto)
  async createSeriesForQualificationTraining(
    @Body() dto: CreateSeriesDto,
  ): Promise<SeriesDto> {
    try {
      return await this.trainingService.addSeriesToQualificationTraining(dto);
    } catch (error) {
      console.error(
        'Ошибка при создании серии для квалификационной тренировки:',
        error,
      );
      throw new BadRequestError(
        'Не удалось создать серию для квалификационной тренировки',
      );
    }
  }

  /**
   * Обновить серию
   * @param id ID серии
   * @param dto Новые данные серии
   * @returns Обновленная серия
   */
  @Patch('/:id')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Обновить серию' })
  @ResponseSchema(SeriesDto)
  async updateSeries(
    @Param('id') id: number,
    @Body() dto: UpdateSeriesDto,
  ): Promise<SeriesDto> {
    return this.seriesService.updateSeries(id, dto);
  }

  /**
   * Удалить серию
   * @param id ID серии
   */
  @Delete('/:id')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Удалить серию' })
  @OnUndefined(204)
  async deleteSeries(@Param('id') id: number): Promise<void> {
    await this.seriesService.deleteSeries(id);
  }

  /**
   * Получить серии по ID тренировки
   * @param trainingId ID тренировки
   * @returns Список серий
   */
  @Get('/training/:trainingId')
  @OpenAPI({ summary: 'Получить серии по id тренировки' })
  @ResponseSchema(SeriesDto, { isArray: true })
  async getSeriesByTrainingId(
    @Param('trainingId') trainingId: number,
  ): Promise<SeriesDto[]> {
    return this.seriesService.getSeriesByTrainingId(trainingId);
  }
}
