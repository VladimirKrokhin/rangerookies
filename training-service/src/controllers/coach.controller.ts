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
import { CoachService } from '../services/coach.service';
import { CreateCoachDto, CoachDto, UpdateCoachDto } from '@app/dto';
import authMiddleware, {
  RequestWithUser,
} from '../middlewares/auth.middleware';

@JsonController('/training/coaches')
@Service()
export class CoachController {
  constructor(private coachService: CoachService) {}

  /**
   * Получить всех тренеров
   * @returns Список тренеров
   */
  @Get('/')
  @OpenAPI({ summary: 'Получить всех тренеров' })
  @ResponseSchema(CoachDto, { isArray: true })
  async getAllCoaches(): Promise<CoachDto[]> {
    try {
      return await this.coachService.getAllCoaches();
    } catch (error) {
      console.error('Ошибка при получении списка тренеров:', error);
      throw new BadRequestError('Не удалось получить список тренеров');
    }
  }

  /**
   * Получить тренера по ID
   * @param id ID тренера
   * @returns Данные тренера
   */
  @Get('/:id')
  @OpenAPI({ summary: 'Получить тренера по id' })
  @ResponseSchema(CoachDto)
  async getCoachById(@Param('id') id: number): Promise<CoachDto> {
    try {
      return await this.coachService.getCoachById(id);
    } catch (error) {
      console.error(`Ошибка при получении тренера с id ${id}:`, error);
      throw new NotFoundError('Тренер не найден');
    }
  }

  /**
   * Создать тренера
   * @param dto Данные для создания тренера
   * @returns Созданный тренер
   */
  @Post('/')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Создать тренера' })
  @ResponseSchema(CoachDto)
  async createCoach(@Body() dto: CreateCoachDto): Promise<CoachDto> {
    try {
      return await this.coachService.createCoach(dto);
    } catch (error) {
      console.error('Ошибка при создании тренера:', error);
      throw new BadRequestError('Не удалось создать тренера');
    }
  }

  /**
   * Удалить тренера
   * @param id ID тренера
   */
  @Delete('/:id')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Удалить тренера' })
  @OnUndefined(204)
  async deleteCoach(@Param('id') id: number): Promise<void> {
    try {
      await this.coachService.deleteCoach(id);
    } catch (error) {
      console.error(`Ошибка при удалении тренера ${id}:`, error);
      throw new NotFoundError('Тренер не найден');
    }
  }

  /**
   * Получить тренера по ID пользователя
   * @param userId ID пользователя
   * @returns Данные тренера
   */
  @Get('/user/:userId')
  @OpenAPI({ summary: 'Получить тренера по id пользователя' })
  @ResponseSchema(CoachDto)
  async getCoachByUserId(@Param('userId') userId: number): Promise<CoachDto> {
    try {
      return await this.coachService.getCoachByUserId(userId);
    } catch (error) {
      console.error(
        `Ошибка при получении тренера для пользователя ${userId}:`,
        error,
      );
      throw new NotFoundError('Тренер не найден');
    }
  }

  /**
   * Получить данные текущего тренера
   * @returns Данные текущего тренера
   */
  @Get('/current')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Получить данные текущего тренера' })
  @ResponseSchema(CoachDto)
  async getCurrentCoach(@Req() request: RequestWithUser): Promise<CoachDto> {
    try {
      const userId = request.user.id;
      return await this.coachService.getCoachByUserId(userId);
    } catch (error) {
      console.error('Ошибка при получении данных текущего тренера:', error);
      throw new NotFoundError('Тренер не найден');
    }
  }

  /**
   * Обновить тренера
   * @param id ID тренера
   * @param dto Данные для обновления тренера
   * @returns Обновленный тренер
   */
  @Patch('/:id')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Обновить тренера' })
  @ResponseSchema(CoachDto)
  async updateCoach(
    @Param('id') id: number,
    @Body() dto: UpdateCoachDto
  ): Promise<CoachDto> {
    try {
      return await this.coachService.updateCoach(id, dto);
    } catch (error) {
      console.error(`Ошибка при обновлении тренера ${id}:`, error);
      throw new BadRequestError('Не удалось обновить тренера');
    }
  }
}
