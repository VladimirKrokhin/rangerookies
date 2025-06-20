import { Service } from 'typedi';
import { dataSource } from '../config/database';
import { NoteEntity } from '../models/note.entity';
import { NoteDto, CreateNoteDto, UpdateNoteDto } from '@app/dto';

@Service()
export class NotesService {
  async getAllNotes(userId: number): Promise<NoteDto[]> {
    const notes = await dataSource
      .getRepository(NoteEntity)
      .find({ where: { userId } });
    return notes.map(this.mapNoteToDto);
  }

  async getNoteById(id: number, userId: number): Promise<NoteDto> {
    const note = await dataSource
      .getRepository(NoteEntity)
      .findOne({ where: { id, userId } });
    if (!note) {
      throw new Error('Заметка не найдена');
    }
    return this.mapNoteToDto(note);
  }

  async createNote(dto: CreateNoteDto, userId: number): Promise<NoteDto> {
    const note = dataSource.getRepository(NoteEntity).create({
      content: dto.content,
      userId,
    });
    const savedNote = await dataSource.getRepository(NoteEntity).save(note);
    return this.mapNoteToDto(savedNote);
  }

  async updateNote(
    id: number,
    dto: UpdateNoteDto,
    userId: number,
  ): Promise<NoteDto> {
    const note = await dataSource
      .getRepository(NoteEntity)
      .findOne({ where: { id, userId } });
    if (!note) {
      throw new Error('Заметка не найдена');
    }
    Object.assign(note, { content: dto.content });
    const updatedNote = await dataSource.getRepository(NoteEntity).save(note);
    return this.mapNoteToDto(updatedNote);
  }

  async deleteNote(id: number, userId: number): Promise<void> {
    const result = await dataSource
      .getRepository(NoteEntity)
      .delete({ id, userId });
    if (result.affected === 0) {
      throw new Error('Заметка не найдена');
    }
  }

  private mapNoteToDto(note: NoteEntity): NoteDto {
    return {
      id: note.id,
      content: note.content,
      userId: note.userId,
      createdAt: note.createdAt.toISOString(),
      updatedAt: (note.editedAt || note.createdAt).toISOString(),
    };
  }
}
