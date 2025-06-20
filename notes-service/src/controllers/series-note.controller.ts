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
import { CreateSeriesNoteDto, SeriesNoteDto } from '@app/dto';
import dataSource from '../config/data-source';
import { NoteEntity } from '../models/note.entity';
import { SeriesNoteEntity } from '../models/series-note.entity';
import authMiddleware, {
  RequestWithUser,
} from '../middlewares/auth.middleware';

@JsonController('/series-notes')
export class SeriesNoteController {
  private noteService: NoteService;

  constructor() {
    const noteRepository = dataSource.getRepository(NoteEntity);
    const seriesNoteRepository = dataSource.getRepository(SeriesNoteEntity);
    this.noteService = new NoteService(
      noteRepository,
      undefined,
      seriesNoteRepository,
    );
  }

  /**
   * Получить все заметки к сериям
   * @returns Список заметок к сериям
   */
  @Get('/')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Получить все заметки к сериям' })
  @ResponseSchema(SeriesNoteDto, { isArray: true })
  async getAllSeriesNotes(): Promise<SeriesNoteDto[]> {
    try {
      return await this.noteService.getAllSeriesNotes();
    } catch (error) {
      console.error('Ошибка при получении списка заметок к сериям:', error);
      throw new BadRequestError('Не удалось получить список заметок к сериям');
    }
  }

  /**
   * Получить заметку к серии по ID
   * @param id ID заметки
   * @returns Данные заметки
   */
  @Get('/:id')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Получить заметку к серии по id' })
  @ResponseSchema(SeriesNoteDto)
  async getSeriesNoteById(@Param('id') id: number): Promise<SeriesNoteDto> {
    try {
      return await this.noteService.getSeriesNoteById(id);
    } catch (error) {
      console.error(`Ошибка при получении заметки к серии с id ${id}:`, error);
      throw new NotFoundError('Заметка к серии не найдена');
    }
  }

  /**
   * Создать заметку к серии
   * @param dto Данные для создания заметки
   * @returns Созданная заметка
   */
  @Post('/')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Создать заметку к серии' })
  @ResponseSchema(SeriesNoteDto)
  async createSeriesNote(
    @Body() dto: CreateSeriesNoteDto,
  ): Promise<SeriesNoteDto> {
    try {
      return await this.noteService.createSeriesNote(dto);
    } catch (error) {
      console.error('Ошибка при создании заметки к серии:', error);
      throw new BadRequestError('Не удалось создать заметку к серии');
    }
  }

  /**
   * Удалить заметку к серии
   * @param id ID заметки
   */
  @Delete('/:id')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Удалить заметку к серии' })
  @OnUndefined(204)
  async deleteSeriesNote(@Param('id') id: number): Promise<void> {
    try {
      await this.noteService.deleteSeriesNote(id);
    } catch (error) {
      console.error(`Ошибка при удалении заметки к серии ${id}:`, error);
      throw new NotFoundError('Заметка к серии не найдена');
    }
  }

  /**
   * Получить заметки по ID серии
   * @param seriesId ID серии
   * @returns Список заметок к серии
   */
  @Get('/series/:seriesId')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Получить заметки по id серии' })
  @ResponseSchema(SeriesNoteDto, { isArray: true })
  async getNotesBySeriesId(
    @Param('seriesId') seriesId: number,
  ): Promise<SeriesNoteDto[]> {
    try {
      return await this.noteService.getNotesBySeriesId(seriesId);
    } catch (error) {
      console.error(
        `Ошибка при получении заметок для серии ${seriesId}:`,
        error,
      );
      throw new BadRequestError('Не удалось получить заметки для серии');
    }
  }

  /**
   * Получить заметки к сериям по ID пользователя
   * @param userId ID пользователя
   * @returns Список заметок к сериям
   */
  @Get('/user/:userId')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Получить заметки к сериям по id пользователя' })
  @ResponseSchema(SeriesNoteDto, { isArray: true })
  async getSeriesNotesByUserId(
    @Param('userId') userId: number,
  ): Promise<SeriesNoteDto[]> {
    try {
      return await this.noteService.getSeriesNotesByUserId(userId);
    } catch (error) {
      console.error(
        `Ошибка при получении заметок к сериям для пользователя ${userId}:`,
        error,
      );
      throw new BadRequestError(
        'Не удалось получить заметки к сериям для пользователя',
      );
    }
  }

  /**
   * Получить заметки к сериям текущего пользователя
   * @returns Список заметок к сериям текущего пользователя
   */
  @Get('/current-user')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Получить заметки к сериям текущего пользователя' })
  @ResponseSchema(SeriesNoteDto, { isArray: true })
  async getCurrentUserSeriesNotes(
    @Req() request: RequestWithUser,
  ): Promise<SeriesNoteDto[]> {
    try {
      const userId = request.user.id;
      return await this.noteService.getSeriesNotesByUserId(userId);
    } catch (error) {
      console.error(
        'Ошибка при получении заметок к сериям текущего пользователя:',
        error,
      );
      throw new BadRequestError(
        'Не удалось получить заметки к сериям текущего пользователя',
      );
    }
  }
}
