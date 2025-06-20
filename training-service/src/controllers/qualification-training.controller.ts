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
import { TrainingService } from '../services/training.service';
import {
  CreateQualificationTrainingDto,
  QualificationTrainingDto,
  UpdateQualificationTrainingDto,
  TrainingType,
} from '@app/dto';
import { dataSource } from '../config/database';
import { AthleteEntity } from '../models/athlete.entity';
import { CoachEntity } from '../models/coach.entity';
import authMiddleware, {
  RequestWithUser,
} from '../middlewares/auth.middleware';
import { TrainingEntity } from '../models/training.entity';
import { SeriesEntity } from '../models/series.entity';
import { ShotEntity } from '../models/shot.entity';
import { FreeTrainingEntity } from '../models/free-training.entity';
import { QualificationTrainingEntity } from '../models/qualification-training.entity';
import { Service } from 'typedi';

@JsonController('/training/qualification-trainings')
@Service()
export class QualificationTrainingController {
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
   * Получить все квалификационные тренировки
   * @returns Список квалификационных тренировок
   */
  @Get('/')
  @OpenAPI({ summary: 'Получить все квалификационные тренировки' })
  @ResponseSchema(QualificationTrainingDto, { isArray: true })
  async getAllQualificationTrainings(): Promise<QualificationTrainingDto[]> {
    try {
      return await this.trainingService.getAllQualificationTrainings();
    } catch (error) {
      console.error(
        'Ошибка при получении списка квалификационных тренировок:',
        error,
      );
      throw new BadRequestError(
        'Не удалось получить список квалификационных тренировок',
      );
    }
  }

  /**
   * Получить квалификационную тренировку по ID
   * @param id ID тренировки
   * @returns Данные квалификационной тренировки
   */
  @Get('/:id')
  @OpenAPI({ summary: 'Получить квалификационную тренировку по id' })
  @ResponseSchema(QualificationTrainingDto)
  async getQualificationTrainingById(
    @Param('id') id: number,
  ): Promise<QualificationTrainingDto> {
    try {
      return await this.trainingService.getQualificationTrainingById(id);
    } catch (error) {
      console.error(
        `Ошибка при получении квалификационной тренировки с id ${id}:`,
        error,
      );
      throw new NotFoundError('Квалификационная тренировка не найдена');
    }
  }

  /**
   * Создать квалификационную тренировку
   * @param dto Данные для создания квалификационной тренировки
   * @returns Созданная квалификационная тренировка
   */
  @Post('/')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Создать квалификационную тренировку' })
  @ResponseSchema(QualificationTrainingDto)
  async createQualificationTraining(
    @Body() dto: CreateQualificationTrainingDto,
  ): Promise<QualificationTrainingDto> {
    try {
      dto.type = TrainingType.QUALIFICATION;
      return await this.trainingService.createQualificationTraining(dto);
    } catch (error) {
      console.error('Ошибка при создании квалификационной тренировки:', error);
      throw new BadRequestError(
        'Не удалось создать квалификационную тренировку',
      );
    }
  }

  /**
   * Обновить квалификационную тренировку
   * @param id ID тренировки
   * @param dto Новые данные квалификационной тренировки
   * @returns Обновленная квалификационная тренировка
   */
  @Patch('/:id')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Обновить квалификационную тренировку' })
  @ResponseSchema(QualificationTrainingDto)
  async updateQualificationTraining(
    @Param('id') id: number,
    @Body() dto: UpdateQualificationTrainingDto,
  ): Promise<QualificationTrainingDto> {
    try {
      return await this.trainingService.updateQualificationTraining(id, dto);
    } catch (error) {
      console.error(
        `Ошибка при обновлении квалификационной тренировки ${id}:`,
        error,
      );
      throw new NotFoundError('Квалификационная тренировка не найдена');
    }
  }

  /**
   * Удалить квалификационную тренировку
   * @param id ID тренировки
   */
  @Delete('/:id')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Удалить квалификационную тренировку' })
  @OnUndefined(204)
  async deleteQualificationTraining(@Param('id') id: number): Promise<void> {
    try {
      await this.trainingService.deleteQualificationTraining(id);
    } catch (error) {
      console.error(
        `Ошибка при удалении квалификационной тренировки ${id}:`,
        error,
      );
      throw new NotFoundError('Квалификационная тренировка не найдена');
    }
  }

  /**
   * Получить квалификационные тренировки по ID спортсмена
   * @param athleteId ID спортсмена
   * @returns Список квалификационных тренировок
   */
  @Get('/athlete/:athleteId')
  @OpenAPI({ summary: 'Получить квалификационные тренировки по id спортсмена' })
  @ResponseSchema(QualificationTrainingDto, { isArray: true })
  async getQualificationTrainingsByAthleteId(
    @Param('athleteId') athleteId: number,
  ): Promise<QualificationTrainingDto[]> {
    try {
      return await this.trainingService.getQualificationTrainingsByAthleteId(
        athleteId,
      );
    } catch (error) {
      console.error(
        `Ошибка при получении квалификационных тренировок для спортсмена ${athleteId}:`,
        error,
      );
      throw new BadRequestError(
        'Не удалось получить квалификационные тренировки для спортсмена',
      );
    }
  }

  /**
   * Получить квалификационные тренировки текущего пользователя
   * @returns Список квалификационных тренировок текущего пользователя
   */
  @Get('/current-user')
  @UseBefore(authMiddleware)
  @OpenAPI({
    summary: 'Получить квалификационные тренировки текущего пользователя',
  })
  @ResponseSchema(QualificationTrainingDto, { isArray: true })
  async getCurrentUserQualificationTrainings(
    @Req() request: RequestWithUser,
  ): Promise<QualificationTrainingDto[]> {
    try {
      const userId = request.user.id;
      // Получаем спортсмена по userId
      const athlete = await dataSource.getRepository(AthleteEntity).findOne({
        where: { userId },
      });
      if (!athlete) {
        throw new BadRequestError('Пользователь не является спортсменом');
      }
      return await this.trainingService.getQualificationTrainingsByAthleteId(
        athlete.id,
      );
    } catch (error) {
      console.error(
        'Ошибка при получении квалификационных тренировок текущего пользователя:',
        error,
      );
      throw new BadRequestError(
        'Не удалось получить квалификационные тренировки текущего пользователя',
      );
    }
  }
}
