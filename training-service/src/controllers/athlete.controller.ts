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
import { AthleteService } from '../services/athlete.service';
import { CreateAthleteDto, AthleteDto, UpdateAthleteDto } from '@app/dto';
import authMiddleware, {
  RequestWithUser,
} from '../middlewares/auth.middleware';
import { dataSource } from '../config/database';
import { AthleteEntity } from '../models/athlete.entity';

@Service()
@JsonController('/training/athletes')
export class AthleteController {
  private athleteService: AthleteService;

  constructor() {
    const athleteRepo = dataSource.getRepository(AthleteEntity);
    this.athleteService = new AthleteService(athleteRepo);
  }

  /**
   * Получить всех спортсменов
   * @returns Список спортсменов
   */
  @Get('/')
  @OpenAPI({
    summary: 'Получить всех спортсменов',
  })
  @ResponseSchema(AthleteDto, { isArray: true })
  async getAllAthletes(): Promise<AthleteDto[]> {
    try {
      return await this.athleteService.getAllAthletes();
    } catch (error) {
      console.error('Ошибка при получении списка спортсменов:', error);
      throw new BadRequestError('Не удалось получить список спортсменов');
    }
  }

  /**
   * Получить спортсмена по ID
   * @param id ID спортсмена
   * @returns Данные спортсмена
   */
  @Get('/:id')
  @OpenAPI({
    summary: 'Получить спортсмена по id',
  })
  @ResponseSchema(AthleteDto)
  async getAthleteById(@Param('id') id: number): Promise<AthleteDto> {
    try {
      return await this.athleteService.getAthleteById(id);
    } catch (error) {
      console.error(`Ошибка при получении спортсмена с id ${id}:`, error);
      throw new NotFoundError('Спортсмен не найден');
    }
  }

  /**
   * Создать спортсмена
   * @param dto Данные для создания спортсмена
   * @returns Созданный спортсмен
   */
  @Post('/')
  @UseBefore(authMiddleware)
  @OpenAPI({
    summary: 'Создать спортсмена',
  })
  @ResponseSchema(AthleteDto)
  async createAthlete(@Body() dto: CreateAthleteDto): Promise<AthleteDto> {
    try {
      return await this.athleteService.createAthlete(dto);
    } catch (error) {
      console.error('Ошибка при создании спортсмена:', error);
      throw new BadRequestError('Не удалось создать спортсмена');
    }
  }

  /**
   * Обновить спортсмена
   * @param id ID спортсмена
   * @param dto Новые данные спортсмена
   * @returns Обновленный спортсмен
   */
  @Patch('/:id')
  @UseBefore(authMiddleware)
  @OpenAPI({
    summary: 'Обновить спортсмена',
  })
  @ResponseSchema(AthleteDto)
  async updateAthlete(
    @Param('id') id: number,
    @Body() dto: UpdateAthleteDto,
  ): Promise<AthleteDto> {
    try {
      return await this.athleteService.updateAthlete(id, dto);
    } catch (error) {
      console.error(`Ошибка при обновлении спортсмена ${id}:`, error);
      throw new NotFoundError('Спортсмен не найден');
    }
  }

  /**
   * Удалить спортсмена
   * @param id ID спортсмена
   */
  @Delete('/:id')
  @UseBefore(authMiddleware)
  @OpenAPI({
    summary: 'Удалить спортсмена',
  })
  @OnUndefined(204)
  async deleteAthlete(@Param('id') id: number): Promise<void> {
    try {
      await this.athleteService.deleteAthlete(id);
    } catch (error) {
      console.error(`Ошибка при удалении спортсмена ${id}:`, error);
      throw new NotFoundError('Спортсмен не найден');
    }
  }

  /**
   * Получить спортсмена по ID пользователя
   * @param userId ID пользователя
   * @returns Данные спортсмена
   */
  @Get('/user/:userId')
  @OpenAPI({
    summary: 'Получить спортсмена по id пользователя',
  })
  @ResponseSchema(AthleteDto)
  async getAthleteByUserId(
    @Param('userId') userId: number,
  ): Promise<AthleteDto> {
    try {
      return await this.athleteService.getAthleteByUserId(userId);
    } catch (error) {
      console.error(
        `Ошибка при получении спортсмена для пользователя ${userId}:`,
        error,
      );
      throw new NotFoundError('Спортсмен не найден');
    }
  }

  /**
   * Получить данные текущего спортсмена
   * @returns Данные текущего спортсмена
   */
  @Get('/current')
  @UseBefore(authMiddleware)
  @OpenAPI({
    summary: 'Получить данные текущего спортсмена',
  })
  @ResponseSchema(AthleteDto)
  async getCurrentAthlete(
    @Req() request: RequestWithUser,
  ): Promise<AthleteDto> {
    try {
      return await this.athleteService.getAthleteByUserId(request.user.id);
    } catch (error) {
      console.error('Ошибка при получении данных текущего спортсмена:', error);
      throw new NotFoundError('Спортсмен не найден');
    }
  }

  /**
   * Получить спортсменов по ID тренера
   * @param coachId ID тренера
   * @returns Список спортсменов
   */
  @Get('/coach/:coachId')
  @OpenAPI({
    summary: 'Получить спортсменов по id тренера',
  })
  @ResponseSchema(AthleteDto, { isArray: true })
  async getAthletesByCoachId(
    @Param('coachId') coachId: number,
  ): Promise<AthleteDto[]> {
    try {
      return await this.athleteService.getAthletesByCoachId(coachId);
    } catch (error) {
      console.error(
        `Ошибка при получении спортсменов для тренера ${coachId}:`,
        error,
      );
      throw new BadRequestError('Не удалось получить список спортсменов');
    }
  }

  /**
   * Получить спортсменов текущего тренера
   * @returns Список спортсменов
   */
  @Get('/current-coach')
  @UseBefore(authMiddleware)
  @OpenAPI({
    summary: 'Получить спортсменов текущего тренера',
  })
  @ResponseSchema(AthleteDto, { isArray: true })
  async getCurrentCoachAthletes(
    @Req() request: RequestWithUser,
  ): Promise<AthleteDto[]> {
    try {
      const coachId = request.user.id;
      return await this.athleteService.getAthletesByCoachId(coachId);
    } catch (error) {
      console.error(
        'Ошибка при получении списка спортсменов текущего тренера:',
        error,
      );
      throw new BadRequestError('Не удалось получить список спортсменов');
    }
  }
}
