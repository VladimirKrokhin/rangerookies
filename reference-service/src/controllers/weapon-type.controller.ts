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
  CreateWeaponTypeDto,
  WeaponTypeDto,
  UpdateWeaponTypeDto,
} from '@app/dto';
import dataSource from '../config/data-source';
import { TargetEntity } from '../models/target.entity';
import { WeaponTypeEntity } from '../models/weapon-type.entity';
import { ExerciseEntity } from '../models/exercise.entity';
import authMiddleware from '../middlewares/auth.middleware';

@Service()
@JsonController('/weapon-types')
@OpenAPI({
  tags: ['Weapon Types'],
})
export class WeaponTypeController {
  constructor(private referenceService: ReferenceService) {}

  /**
   * Получить все типы оружия
   * @returns Список типов оружия
   */
  @Get('/')
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

  /**
   * Получить тип оружия по ID
   * @param id ID типа оружия
   * @returns Данные типа оружия
   */
  @Get('/:id')
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

  /**
   * Создать тип оружия
   * @param dto Данные для создания типа оружия
   * @returns Созданный тип оружия
   */
  @Post('/')
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

  /**
   * Обновить тип оружия
   * @param id ID типа оружия
   * @param dto Новые данные типа оружия
   * @returns Обновленный тип оружия
   */
  @Patch('/:id')
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

  /**
   * Удалить тип оружия
   * @param id ID типа оружия
   */
  @Delete('/:id')
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
