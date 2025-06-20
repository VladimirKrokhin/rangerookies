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
import {
  ExerciseDto,
  TargetDto,
  WeaponTypeDto,
  CreateExerciseDto,
  UpdateExerciseDto,
  CreateTargetDto,
  UpdateTargetDto,
  CreateWeaponTypeDto,
  UpdateWeaponTypeDto,
} from '@app/dto';
import authMiddleware from '../middlewares/auth.middleware';

@Service()
@JsonController('/reference')
@OpenAPI({
  tags: ['Reference'],
})
export class ReferenceController {
  constructor(private referenceService: ReferenceService) {}

  // Упражнения
  @Get('/exercises')
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
    return this.referenceService.getAllExercises();
  }

  @Get('/exercises/:id')
  @ResponseSchema(ExerciseDto)
  @OpenAPI({
    summary: 'Получить упражнение по ID',
    responses: {
      '200': {
        description: 'Упражнение найдено',
      },
      '404': {
        description: 'Упражнение не найдено',
      },
    },
  })
  async getExerciseById(@Param('id') id: number): Promise<ExerciseDto> {
    return this.referenceService.getExerciseById(id);
  }

  @Post('/exercises')
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
    return this.referenceService.createExercise(dto);
  }

  @Patch('/exercises/:id')
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

  @Delete('/exercises/:id')
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

  // Цели
  @Get('/targets')
  @ResponseSchema(TargetDto, { isArray: true })
  @OpenAPI({
    summary: 'Получить все мишени',
    responses: {
      '200': {
        description: 'Список мишеней',
      },
    },
  })
  async getAllTargets(): Promise<TargetDto[]> {
    return this.referenceService.getAllTargets();
  }

  @Get('/targets/:id')
  @ResponseSchema(TargetDto)
  @OpenAPI({
    summary: 'Получить мишень по ID',
    responses: {
      '200': {
        description: 'Мишень найдена',
      },
      '404': {
        description: 'Мишень не найдена',
      },
    },
  })
  async getTargetById(@Param('id') id: number): Promise<TargetDto> {
    return this.referenceService.getTargetById(id);
  }

  @Post('/targets')
  @UseBefore(authMiddleware)
  @ResponseSchema(TargetDto)
  @OpenAPI({
    summary: 'Создать новую мишень',
    responses: {
      '201': {
        description: 'Мишень создана',
      },
    },
  })
  async createTarget(@Body() dto: CreateTargetDto): Promise<TargetDto> {
    return this.referenceService.createTarget(dto);
  }

  @Patch('/targets/:id')
  @UseBefore(authMiddleware)
  @ResponseSchema(TargetDto)
  @OpenAPI({
    summary: 'Обновить мишень',
    responses: {
      '200': {
        description: 'Мишень обновлена',
      },
      '404': {
        description: 'Мишень не найдена',
      },
    },
  })
  async updateTarget(
    @Param('id') id: number,
    @Body() dto: UpdateTargetDto,
  ): Promise<TargetDto> {
    return this.referenceService.updateTarget(id, dto);
  }

  @Delete('/targets/:id')
  @UseBefore(authMiddleware)
  @HttpCode(204)
  @OnUndefined(204)
  @OpenAPI({
    summary: 'Удалить мишень',
    responses: {
      '204': {
        description: 'Мишень удалена',
      },
      '404': {
        description: 'Мишень не найдена',
      },
    },
  })
  async deleteTarget(@Param('id') id: number): Promise<void> {
    await this.referenceService.deleteTarget(id);
  }

  // Типы оружия
  @Get('/weapon-types')
  @ResponseSchema(WeaponTypeDto, { isArray: true })
  @OpenAPI({
    summary: 'Получить все типы оружия',
    responses: {
      '200': {
        description: 'Список типов оружия',
      },
    },
  })
  async getAllWeaponTypes(): Promise<WeaponTypeDto[]> {
    return this.referenceService.getAllWeaponTypes();
  }

  @Get('/weapon-types/:id')
  @ResponseSchema(WeaponTypeDto)
  @OpenAPI({
    summary: 'Получить тип оружия по ID',
    responses: {
      '200': {
        description: 'Тип оружия найден',
      },
      '404': {
        description: 'Тип оружия не найден',
      },
    },
  })
  async getWeaponTypeById(@Param('id') id: number): Promise<WeaponTypeDto> {
    return this.referenceService.getWeaponTypeById(id);
  }

  @Post('/weapon-types')
  @UseBefore(authMiddleware)
  @ResponseSchema(WeaponTypeDto)
  @OpenAPI({
    summary: 'Создать новый тип оружия',
    responses: {
      '201': {
        description: 'Тип оружия создан',
      },
    },
  })
  async createWeaponType(
    @Body() dto: CreateWeaponTypeDto,
  ): Promise<WeaponTypeDto> {
    return this.referenceService.createWeaponType(dto);
  }

  @Patch('/weapon-types/:id')
  @UseBefore(authMiddleware)
  @ResponseSchema(WeaponTypeDto)
  @OpenAPI({
    summary: 'Обновить тип оружия',
    responses: {
      '200': {
        description: 'Тип оружия обновлен',
      },
      '404': {
        description: 'Тип оружия не найден',
      },
    },
  })
  async updateWeaponType(
    @Param('id') id: number,
    @Body() dto: UpdateWeaponTypeDto,
  ): Promise<WeaponTypeDto> {
    return this.referenceService.updateWeaponType(id, dto);
  }

  @Delete('/weapon-types/:id')
  @UseBefore(authMiddleware)
  @HttpCode(204)
  @OnUndefined(204)
  @OpenAPI({
    summary: 'Удалить тип оружия',
    responses: {
      '204': {
        description: 'Тип оружия удален',
      },
      '404': {
        description: 'Тип оружия не найден',
      },
    },
  })
  async deleteWeaponType(@Param('id') id: number): Promise<void> {
    await this.referenceService.deleteWeaponType(id);
  }
}
