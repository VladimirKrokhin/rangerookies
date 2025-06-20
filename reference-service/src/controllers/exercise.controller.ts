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
  HttpCode,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { ReferenceService } from '../services/reference.service';
import { CreateExerciseDto, ExerciseDto, UpdateExerciseDto } from '@app/dto';
import authMiddleware from '../middlewares/auth.middleware';

@Service()
@JsonController('/exercises')
@OpenAPI({
  tags: ['Exercises'],
})
export class ExerciseController {
  constructor(private referenceService: ReferenceService) {}

  /**
   * Получить все упражнения
   * @returns Список упражнений
   */
  @Get('/')
  @ResponseSchema(ExerciseDto, { isArray: true })
  @OpenAPI({
    summary: 'Получить все упражнения',
    responses: {
      '200': {
        description: 'Список упражнений',
      },
    },
  })
  async getAllExercises(): Promise<ExerciseDto[]> {
    try {
      return await this.referenceService.getAllExercises();
    } catch (error) {
      console.error('Ошибка при получении списка упражнений:', error);
      throw new BadRequestError('Не удалось получить список упражнений');
    }
  }

  /**
   * Получить упражнение по ID
   * @param id ID упражнения
   * @returns Данные упражнения
   */
  @Get('/:id')
  @ResponseSchema(ExerciseDto)
  @OpenAPI({
    summary: 'Получить упражнение по ID',
    description: 'Получение данных упражнения по его идентификатору',
  })
  async getExerciseById(@Param('id') id: number): Promise<ExerciseDto> {
    try {
      return await this.referenceService.getExerciseById(id);
    } catch (error) {
      console.error(`Ошибка при получении упражнения с id ${id}:`, error);
      throw new NotFoundError('Упражнение не найдено');
    }
  }

  /**
   * Создать упражнение
   * @param dto Данные для создания упражнения
   * @returns Созданное упражнение
   */
  @Post('/')
  @UseBefore(authMiddleware)
  @ResponseSchema(ExerciseDto)
  @OpenAPI({
    summary: 'Создать новое упражнение',
    responses: {
      '201': {
        description: 'Упражнение создано',
      },
    },
  })
  async createExercise(@Body() dto: CreateExerciseDto): Promise<ExerciseDto> {
    try {
      return await this.referenceService.createExercise(dto);
    } catch (error) {
      console.error('Ошибка при создании упражнения:', error);
      throw new BadRequestError('Не удалось создать упражнение');
    }
  }

  /**
   * Обновить упражнение
   * @param id ID упражнения
   * @param dto Новые данные упражнения
   * @returns Обновленное упражнение
   */
  @Patch('/:id')
  @UseBefore(authMiddleware)
  @ResponseSchema(ExerciseDto)
  @OpenAPI({
    summary: 'Обновить упражнение',
    responses: {
      '200': {
        description: 'Упражнение обновлено',
      },
      '404': {
        description: 'Упражнение не найдено',
      },
    },
  })
  async updateExercise(
    @Param('id') id: number,
    @Body() dto: UpdateExerciseDto,
  ): Promise<ExerciseDto> {
    return this.referenceService.updateExercise(id, dto);
  }

  /**
   * Удалить упражнение
   * @param id ID упражнения
   */
  @Delete('/:id')
  @UseBefore(authMiddleware)
  @HttpCode(204)
  @OnUndefined(204)
  @OpenAPI({
    summary: 'Удалить упражнение',
    responses: {
      '204': {
        description: 'Упражнение удалено',
      },
      '404': {
        description: 'Упражнение не найдено',
      },
    },
  })
  async deleteExercise(@Param('id') id: number): Promise<void> {
    await this.referenceService.deleteExercise(id);
  }

  @Get('/weapon-type/:weaponTypeId')
  @OpenAPI({
    summary: 'Получить упражнения по типу оружия',
    description: 'Получение списка упражнений для определенного типа оружия',
  })
  @ResponseSchema(ExerciseDto, { isArray: true })
  async getExercisesByWeaponType(
    @Param('weaponTypeId') weaponTypeId: number,
  ): Promise<ExerciseDto[]> {
    try {
      return await this.referenceService.getExercisesByWeaponType(weaponTypeId);
    } catch (error) {
      console.error(
        `Ошибка при получении упражнений для типа оружия ${weaponTypeId}:`,
        error,
      );
      throw new BadRequestError(
        'Не удалось получить упражнения для типа оружия',
      );
    }
  }
}
