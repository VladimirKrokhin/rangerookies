import {
  Body,
  Delete,
  Get,
  JsonController,
  OnUndefined,
  Param,
  Post,
  UseBefore,
  NotFoundError,
  BadRequestError,
  Req,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { NoteService } from '../services/note.service';
import { CreateTrainingNoteDto, TrainingNoteDto } from '@app/dto';
import { dataSource } from '../config/database';
import { NoteEntity } from '../models/note.entity';
import { TrainingNoteEntity } from '../models/training-note.entity';
import authMiddleware, {
  RequestWithUser,
} from '../middlewares/auth.middleware';

@JsonController()
export class TrainingNoteController {
  private noteService: NoteService;

  constructor() {
    const noteRepository = dataSource.getRepository(NoteEntity);
    const trainingNoteRepository = dataSource.getRepository(TrainingNoteEntity);
    this.noteService = new NoteService(noteRepository, trainingNoteRepository);
  }

  /**
   * Получить все заметки к тренировкам
   * @returns Список заметок к тренировкам
   */
  @Get('/')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Получить все заметки к тренировкам' })
  @ResponseSchema(TrainingNoteDto, { isArray: true })
  async getAllTrainingNotes(): Promise<TrainingNoteDto[]> {
    try {
      return await this.noteService.getAllTrainingNotes();
    } catch (error) {
      console.error(
        'Ошибка при получении списка заметок к тренировкам:',
        error,
      );
      throw new BadRequestError(
        'Не удалось получить список заметок к тренировкам',
      );
    }
  }

  /**
   * Получить заметку к тренировке по ID
   * @param id ID заметки
   * @returns Данные заметки
   */
  @Get('/:id')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Получить заметку к тренировке по id' })
  @ResponseSchema(TrainingNoteDto)
  async getTrainingNoteById(@Param('id') id: number): Promise<TrainingNoteDto> {
    try {
      return await this.noteService.getTrainingNoteById(id);
    } catch (error) {
      console.error(
        `Ошибка при получении заметки к тренировке с id ${id}:`,
        error,
      );
      throw new NotFoundError('Заметка к тренировке не найдена');
    }
  }

  /**
   * Создать заметку к тренировке
   * @param dto Данные для создания заметки
   * @returns Созданная заметка
   */
  @Post('/')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Создать заметку к тренировке' })
  @ResponseSchema(TrainingNoteDto)
  async createTrainingNote(
    @Body() dto: CreateTrainingNoteDto,
  ): Promise<TrainingNoteDto> {
    try {
      return await this.noteService.createTrainingNote(dto);
    } catch (error) {
      console.error('Ошибка при создании заметки к тренировке:', error);
      throw new BadRequestError('Не удалось создать заметку к тренировке');
    }
  }

  /**
   * Удалить заметку к тренировке
   * @param id ID заметки
   */
  @Delete('/:id')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Удалить заметку к тренировке' })
  @OnUndefined(204)
  async deleteTrainingNote(@Param('id') id: number): Promise<void> {
    try {
      await this.noteService.deleteTrainingNote(id);
    } catch (error) {
      console.error(`Ошибка при удалении заметки к тренировке ${id}:`, error);
      throw new NotFoundError('Заметка к тренировке не найдена');
    }
  }

  /**
   * Получить заметки по ID тренировки
   * @param trainingId ID тренировки
   * @returns Список заметок к тренировке
   */
  @Get('/training/:trainingId')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Получить заметки по id тренировки' })
  @ResponseSchema(TrainingNoteDto, { isArray: true })
  async getNotesByTrainingId(
    @Param('trainingId') trainingId: number,
  ): Promise<TrainingNoteDto[]> {
    try {
      return await this.noteService.getNotesByTrainingId(trainingId);
    } catch (error) {
      console.error(
        `Ошибка при получении заметок для тренировки ${trainingId}:`,
        error,
      );
      throw new BadRequestError('Не удалось получить заметки для тренировки');
    }
  }

  /**
   * Получить заметки к тренировкам по ID пользователя
   * @param userId ID пользователя
   * @returns Список заметок к тренировкам
   */
  @Get('/user/:userId')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Получить заметки к тренировкам по id пользователя' })
  @ResponseSchema(TrainingNoteDto, { isArray: true })
  async getTrainingNotesByUserId(
    @Param('userId') userId: number,
  ): Promise<TrainingNoteDto[]> {
    try {
      return await this.noteService.getTrainingNotesByUserId(userId);
    } catch (error) {
      console.error(
        `Ошибка при получении заметок к тренировкам для пользователя ${userId}:`,
        error,
      );
      throw new BadRequestError(
        'Не удалось получить заметки к тренировкам для пользователя',
      );
    }
  }

  /**
   * Получить заметки к тренировкам текущего пользователя
   * @returns Список заметок к тренировкам текущего пользователя
   */
  @Get('/current-user')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Получить заметки к тренировкам текущего пользователя' })
  @ResponseSchema(TrainingNoteDto, { isArray: true })
  async getCurrentUserTrainingNotes(
    @Req() request: RequestWithUser,
  ): Promise<TrainingNoteDto[]> {
    try {
      const userId = request.user.id;
      return await this.noteService.getTrainingNotesByUserId(userId);
    } catch (error) {
      console.error(
        'Ошибка при получении заметок к тренировкам текущего пользователя:',
        error,
      );
      throw new BadRequestError(
        'Не удалось получить заметки к тренировкам текущего пользователя',
      );
    }
  }
}
