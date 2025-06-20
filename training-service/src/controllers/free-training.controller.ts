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
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { TrainingService } from '../services/training.service';
import {
  CreateFreeTrainingDto,
  FreeTrainingDto,
  UpdateFreeTrainingDto,
} from '@app/dto';
import { dataSource } from '../config/database';
import { AthleteEntity } from '../models/athlete.entity';
import { CoachEntity } from '../models/coach.entity';
import { TrainingEntity } from '../models/training.entity';
import { FreeTrainingEntity } from '../models/free-training.entity';
import { QualificationTrainingEntity } from '../models/qualification-training.entity';
import { SeriesEntity } from '../models/series.entity';
import { ShotEntity } from '../models/shot.entity';
import authMiddleware, {
  RequestWithUser,
} from '../middlewares/auth.middleware';

@JsonController('/training/free-trainings')
@Service()
export class FreeTrainingController {
  private trainingService: TrainingService;

  constructor() {
    this.trainingService = new TrainingService(
      dataSource.getRepository(TrainingEntity),
      dataSource.getRepository(SeriesEntity),
      dataSource.getRepository(ShotEntity),
      dataSource.getRepository(FreeTrainingEntity),
      dataSource.getRepository(QualificationTrainingEntity),
    );
  }

  /**
   * Получить все свободные тренировки
   * @returns Список свободных тренировок
   */
  @Get('/')
  @OpenAPI({ summary: 'Получить все свободные тренировки' })
  @ResponseSchema(FreeTrainingDto, { isArray: true })
  async getAllFreeTrainings(): Promise<FreeTrainingDto[]> {
    try {
      return await this.trainingService.getAllFreeTrainings();
    } catch (error) {
      console.error('Ошибка при получении списка свободных тренировок:', error);
      throw new BadRequestError(
        'Не удалось получить список свободных тренировок',
      );
    }
  }

  /**
   * Получить свободную тренировку по ID
   * @param id ID тренировки
   * @returns Данные свободной тренировки
   */
  @Get('/:id')
  @OpenAPI({ summary: 'Получить свободную тренировку по id' })
  @ResponseSchema(FreeTrainingDto)
  async getFreeTrainingById(@Param('id') id: number): Promise<FreeTrainingDto> {
    try {
      return await this.trainingService.getFreeTrainingById(id);
    } catch (error) {
      console.error(
        `Ошибка при получении свободной тренировки с id ${id}:`,
        error,
      );
      throw new NotFoundError('Свободная тренировка не найдена');
    }
  }

  /**
   * Создать свободную тренировку
   * @param dto Данные для создания свободной тренировки
   * @returns Созданная свободная тренировка
   */
  @Post('/')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Создать свободную тренировку' })
  @ResponseSchema(FreeTrainingDto)
  async createFreeTraining(
    @Body() dto: CreateFreeTrainingDto,
  ): Promise<FreeTrainingDto> {
    try {
      return await this.trainingService.createFreeTraining(dto);
    } catch (error) {
      console.error('Ошибка при создании свободной тренировки:', error);
      throw new BadRequestError('Не удалось создать свободную тренировку');
    }
  }

  /**
   * Обновить свободную тренировку
   * @param id ID тренировки
   * @param dto Новые данные свободной тренировки
   * @returns Обновленная свободная тренировка
   */
  @Patch('/:id')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Обновить свободную тренировку' })
  @ResponseSchema(FreeTrainingDto)
  async updateFreeTraining(
    @Param('id') id: number,
    @Body() dto: UpdateFreeTrainingDto,
  ): Promise<FreeTrainingDto> {
    try {
      return await this.trainingService.updateFreeTraining(id, dto);
    } catch (error) {
      console.error(`Ошибка при обновлении свободной тренировки ${id}:`, error);
      throw new NotFoundError('Свободная тренировка не найдена');
    }
  }

  /**
   * Удалить свободную тренировку
   * @param id ID тренировки
   */
  @Delete('/:id')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Удалить свободную тренировку' })
  @OnUndefined(204)
  async deleteFreeTraining(@Param('id') id: number): Promise<void> {
    try {
      await this.trainingService.deleteTraining(id);
    } catch (error) {
      console.error(`Ошибка при удалении свободной тренировки ${id}:`, error);
      throw new NotFoundError('Свободная тренировка не найдена');
    }
  }

  /**
   * Получить свободные тренировки по ID спортсмена
   * @param athleteId ID спортсмена
   * @returns Список свободных тренировок
   */
  @Get('/athlete/:athleteId')
  @OpenAPI({ summary: 'Получить свободные тренировки по id спортсмена' })
  @ResponseSchema(FreeTrainingDto, { isArray: true })
  async getFreeTrainingsByAthleteId(
    @Param('athleteId') athleteId: number,
  ): Promise<FreeTrainingDto[]> {
    try {
      return await this.trainingService.getFreeTrainingsByAthleteId(athleteId);
    } catch (error) {
      console.error(
        `Ошибка при получении свободных тренировок для спортсмена ${athleteId}:`,
        error,
      );
      throw new BadRequestError(
        'Не удалось получить свободные тренировки для спортсмена',
      );
    }
  }

  /**
   * Получить свободные тренировки текущего пользователя
   * @returns Список свободных тренировок текущего пользователя
   */
  @Get('/current-user')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Получить свободные тренировки текущего пользователя' })
  @ResponseSchema(FreeTrainingDto, { isArray: true })
  async getCurrentUserFreeTrainings(
    @Req() request: RequestWithUser,
  ): Promise<FreeTrainingDto[]> {
    try {
      const userId = request.user.id;
      const athlete = await dataSource.getRepository(AthleteEntity).findOne({
        where: { userId },
      });
      if (!athlete) {
        throw new BadRequestError('Пользователь не является спортсменом');
      }
      return await this.trainingService.getFreeTrainingsByAthleteId(athlete.id);
    } catch (error) {
      console.error(
        'Ошибка при получении свободных тренировок текущего пользователя:',
        error,
      );
      throw new BadRequestError(
        'Не удалось получить свободные тренировки текущего пользователя',
      );
    }
  }
}
