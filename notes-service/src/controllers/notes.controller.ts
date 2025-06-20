import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseBefore,
  HttpCode,
  OnUndefined,
  Req,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { NotesService } from '../services/notes.service';
import { NoteDto, CreateNoteDto, UpdateNoteDto } from '@app/dto';
import authMiddleware, {
  RequestWithUser,
} from '../middlewares/auth.middleware';

@Service()
@JsonController('/notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Get('/')
  @UseBefore(authMiddleware)
  @ResponseSchema(NoteDto, { isArray: true })
  @OpenAPI({
    summary: 'Получить все заметки пользователя',
    responses: {
      '200': {
        description: 'Список заметок',
      },
    },
  })
  async getAllNotes(@Req() req: RequestWithUser): Promise<NoteDto[]> {
    return this.notesService.getAllNotes(req.user.id);
  }

  @Get('/:id')
  @UseBefore(authMiddleware)
  @ResponseSchema(NoteDto)
  @OpenAPI({
    summary: 'Получить заметку по ID',
    responses: {
      '200': {
        description: 'Заметка найдена',
      },
      '404': {
        description: 'Заметка не найдена',
      },
    },
  })
  async getNoteById(
    @Param('id') id: number,
    @Req() req: RequestWithUser,
  ): Promise<NoteDto> {
    return this.notesService.getNoteById(id, req.user.id);
  }

  @Post('/')
  @UseBefore(authMiddleware)
  @HttpCode(201)
  @ResponseSchema(NoteDto)
  @OpenAPI({
    summary: 'Создать новую заметку',
    responses: {
      '201': {
        description: 'Заметка создана',
      },
    },
  })
  async createNote(
    @Body() dto: CreateNoteDto,
    @Req() req: RequestWithUser,
  ): Promise<NoteDto> {
    return this.notesService.createNote(dto, req.user.id);
  }

  @Put('/:id')
  @UseBefore(authMiddleware)
  @ResponseSchema(NoteDto)
  @OpenAPI({
    summary: 'Обновить заметку',
    responses: {
      '200': {
        description: 'Заметка обновлена',
      },
      '404': {
        description: 'Заметка не найдена',
      },
    },
  })
  async updateNote(
    @Param('id') id: number,
    @Body() dto: UpdateNoteDto,
    @Req() req: RequestWithUser,
  ): Promise<NoteDto> {
    return this.notesService.updateNote(id, dto, req.user.id);
  }

  @Delete('/:id')
  @UseBefore(authMiddleware)
  @HttpCode(204)
  @OnUndefined(204)
  @OpenAPI({
    summary: 'Удалить заметку',
    responses: {
      '204': {
        description: 'Заметка удалена',
      },
      '404': {
        description: 'Заметка не найдена',
      },
    },
  })
  async deleteNote(
    @Param('id') id: number,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    await this.notesService.deleteNote(id, req.user.id);
  }
}
