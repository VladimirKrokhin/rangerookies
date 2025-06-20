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
import { NoteService } from '../services/note.service';
import { CreateNoteDto, NoteDto, UpdateNoteDto } from '@app/dto';
import { dataSource } from '../config/database';
import { NoteEntity } from '../models/note.entity';
import authMiddleware, {
  RequestWithUser,
} from '../middlewares/auth.middleware';
import { Service } from 'typedi';

@Service()
@JsonController('/api/notes')
export class NoteController {
  private noteService: NoteService;

  constructor() {
    const noteRepository = dataSource.getRepository(NoteEntity);
    this.noteService = new NoteService(noteRepository);
  }

  /**
   * Получить все заметки
   * @returns Список заметок
   */
  @Get('/')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Получить все заметки' })
  @ResponseSchema(NoteDto, { isArray: true })
  async getAllNotes(): Promise<NoteDto[]> {
    try {
      return await this.noteService.getAllNotes();
    } catch (error) {
      console.error('Ошибка при получении списка заметок:', error);
      throw new BadRequestError('Не удалось получить список заметок');
    }
  }

  /**
   * Получить заметку по ID
   * @param id ID заметки
   * @returns Данные заметки
   */
  @Get('/:id')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Получить заметку по id' })
  @ResponseSchema(NoteDto)
  async getNoteById(@Param('id') id: number): Promise<NoteDto> {
    try {
      return await this.noteService.getNoteById(id);
    } catch (error) {
      console.error(`Ошибка при получении заметки с id ${id}:`, error);
      throw new NotFoundError('Заметка не найдена');
    }
  }

  /**
   * Создать заметку
   * @param dto Данные для создания заметки
   * @returns Созданная заметка
   */
  @Post('/')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Создать заметку' })
  @ResponseSchema(NoteDto)
  async createNote(@Body() dto: CreateNoteDto): Promise<NoteDto> {
    try {
      return await this.noteService.createNote(dto);
    } catch (error) {
      console.error('Ошибка при создании заметки:', error);
      throw new BadRequestError('Не удалось создать заметку');
    }
  }

  /**
   * Обновить заметку
   * @param id ID заметки
   * @param dto Новые данные заметки
   * @returns Обновленная заметка
   */
  @Patch('/:id')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Обновить заметку' })
  @ResponseSchema(NoteDto)
  async updateNote(
    @Param('id') id: number,
    @Body() dto: UpdateNoteDto,
  ): Promise<NoteDto> {
    try {
      return await this.noteService.updateNote(id, dto);
    } catch (error) {
      console.error(`Ошибка при обновлении заметки ${id}:`, error);
      throw new NotFoundError('Заметка не найдена');
    }
  }

  /**
   * Удалить заметку
   * @param id ID заметки
   */
  @Delete('/:id')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Удалить заметку' })
  @OnUndefined(204)
  async deleteNote(@Param('id') id: number): Promise<void> {
    try {
      await this.noteService.deleteNote(id);
    } catch (error) {
      console.error(`Ошибка при удалении заметки ${id}:`, error);
      throw new NotFoundError('Заметка не найдена');
    }
  }

  /**
   * Получить заметки по ID пользователя
   * @param userId ID пользователя
   * @returns Список заметок
   */
  @Get('/user/:userId')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Получить заметки по id пользователя' })
  @ResponseSchema(NoteDto, { isArray: true })
  async getNotesByUserId(@Param('userId') userId: number): Promise<NoteDto[]> {
    try {
      return await this.noteService.getNotesByUserId(userId);
    } catch (error) {
      console.error(
        `Ошибка при получении заметок для пользователя ${userId}:`,
        error,
      );
      throw new BadRequestError('Не удалось получить заметки для пользователя');
    }
  }

  /**
   * Получить заметки текущего пользователя
   * @returns Список заметок текущего пользователя
   */
  @Get('/current-user')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Получить заметки текущего пользователя' })
  @ResponseSchema(NoteDto, { isArray: true })
  async getCurrentUserNotes(
    @Req() request: RequestWithUser,
  ): Promise<NoteDto[]> {
    try {
      const userId = request.user.id;
      return await this.noteService.getNotesByUserId(userId);
    } catch (error) {
      console.error(
        'Ошибка при получении заметок текущего пользователя:',
        error,
      );
      throw new BadRequestError(
        'Не удалось получить заметки текущего пользователя',
      );
    }
  }
}
