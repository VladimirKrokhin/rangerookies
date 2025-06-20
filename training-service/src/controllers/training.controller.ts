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
  HttpCode,
  Put,
  CurrentUser,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { TrainingService } from '../services/training.service';
import authMiddleware, {
  RequestWithUser,
} from '../middlewares/auth.middleware';
import { RabbitMQService } from '../services/rabbitmq.service';
import { Service } from 'typedi';
import { RoutingKey, RabbitMQMessage } from '@app/common';
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
} from '@app/dto';

@JsonController('/trainings')
@Service()
export class TrainingController {
  constructor(
    private trainingService: TrainingService,
    private rabbitMQService: RabbitMQService,
  ) {}

  /**
   * Получить все тренировки
   * @returns Список тренировок
   */
  @Get('/')
  @OpenAPI({ summary: 'Получить все тренировки' })
  @ResponseSchema(TrainingDto, { isArray: true })
  async getAllTrainings(): Promise<TrainingDto[]> {
    return this.trainingService.getAllTrainings();
  }

  /**
   * Получить тренировку по ID
   * @param id ID тренировки
   * @returns Данные тренировки
   */
  @Get('/:id')
  @OpenAPI({ summary: 'Получить тренировку по id' })
  @ResponseSchema(TrainingDto)
  async getTrainingById(@Param('id') id: number): Promise<TrainingDto> {
    return this.trainingService.getTrainingById(id);
  }

  /**
   * Создать тренировку
   * @param dto Данные для создания тренировки
   * @returns Созданная тренировка
   */
  @Post('/')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Создать тренировку' })
  @ResponseSchema(TrainingDto)
  async createTraining(@Body() dto: CreateTrainingDto): Promise<TrainingDto> {
    const result = await this.trainingService.createTraining(dto);
    const message: RabbitMQMessage<{
      id: number;
      type: string;
      data: TrainingDto;
    }> = {
      type: RoutingKey.TRAINING_CREATED,
      data: {
        id: result.id,
        type: result.type,
        data: result,
      },
      timestamp: Date.now(),
    };
    await this.rabbitMQService.sendMessage(
      RoutingKey.TRAINING_CREATED,
      message.data,
    );
    return result;
  }

  @Post('/free')
  @HttpCode(201)
  @OpenAPI({ summary: 'Создать свободную тренировку' })
  @ResponseSchema(FreeTrainingDto)
  async createFreeTraining(
    @Body() training: CreateFreeTrainingDto,
  ): Promise<FreeTrainingDto> {
    const result = await this.trainingService.createFreeTraining(training);
    const message: RabbitMQMessage<{
      id: number;
      type: string;
      data: FreeTrainingDto;
    }> = {
      type: RoutingKey.TRAINING_CREATED,
      data: {
        id: result.id,
        type: 'free',
        data: result,
      },
      timestamp: Date.now(),
    };
    await this.rabbitMQService.sendMessage(
      RoutingKey.TRAINING_CREATED,
      message.data,
    );
    return result;
  }

  @Post('/qualification')
  @HttpCode(201)
  @OpenAPI({ summary: 'Создать квалификационную тренировку' })
  @ResponseSchema(QualificationTrainingDto)
  async createQualificationTraining(
    @Body() training: CreateQualificationTrainingDto,
  ): Promise<QualificationTrainingDto> {
    const result =
      await this.trainingService.createQualificationTraining(training);
    const message: RabbitMQMessage<{
      id: number;
      type: string;
      data: QualificationTrainingDto;
    }> = {
      type: RoutingKey.TRAINING_CREATED,
      data: {
        id: result.id,
        type: 'qualification',
        data: result,
      },
      timestamp: Date.now(),
    };
    await this.rabbitMQService.sendMessage(
      RoutingKey.TRAINING_CREATED,
      message.data,
    );
    return result;
  }

  @Put('/free/:id')
  @OpenAPI({ summary: 'Обновить свободную тренировку' })
  @ResponseSchema(FreeTrainingDto)
  async updateFreeTraining(
    @Param('id') id: number,
    @Body() training: UpdateFreeTrainingDto,
  ): Promise<FreeTrainingDto> {
    const result = await this.trainingService.updateFreeTraining(id, training);
    const message: RabbitMQMessage<{
      id: number;
      type: string;
      data: FreeTrainingDto;
    }> = {
      type: RoutingKey.TRAINING_UPDATED,
      data: {
        id: result.id,
        type: 'free',
        data: result,
      },
      timestamp: Date.now(),
    };
    await this.rabbitMQService.sendMessage(
      RoutingKey.TRAINING_UPDATED,
      message.data,
    );
    return result;
  }

  @Put('/qualification/:id')
  @OpenAPI({ summary: 'Обновить квалификационную тренировку' })
  @ResponseSchema(QualificationTrainingDto)
  async updateQualificationTraining(
    @Param('id') id: number,
    @Body() training: UpdateQualificationTrainingDto,
  ): Promise<QualificationTrainingDto> {
    const result = await this.trainingService.updateQualificationTraining(
      id,
      training,
    );
    const message: RabbitMQMessage<{
      id: number;
      type: string;
      data: QualificationTrainingDto;
    }> = {
      type: RoutingKey.TRAINING_UPDATED,
      data: {
        id: result.id,
        type: 'qualification',
        data: result,
      },
      timestamp: Date.now(),
    };
    await this.rabbitMQService.sendMessage(
      RoutingKey.TRAINING_UPDATED,
      message.data,
    );
    return result;
  }
  
  /**
   * Обновить тренировку
   * @param id ID тренировки
   * @param dto Новые данные тренировки
   * @returns Обновленная тренировка
   */
  @Patch('/:id')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Обновить тренировку' })
  @ResponseSchema(TrainingDto)
  async updateTraining(
    @Param('id') id: number,
    @Body() dto: UpdateTrainingDto,
  ): Promise<TrainingDto> {
    return await this.trainingService.updateTraining(id, dto);
  }

  /**
   * Удалить тренировку
   * @param id ID тренировки
   */
  @Delete('/:id')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Удалить тренировку' })
  @OnUndefined(204)
  async deleteTraining(@Param('id') id: number): Promise<void> {
    await this.trainingService.deleteTraining(id);
  }
}
