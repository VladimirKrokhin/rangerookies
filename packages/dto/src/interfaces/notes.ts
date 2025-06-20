import { NoteDto } from '../note.dto';

/**
 * Интерфейс сервиса заметок
 */
export interface INotesService {
  /**
   * Получить все заметки
   */
  getAllNotes(): Promise<NoteDto[]>;

  /**
   * Получить заметку по ID
   * @param id ID заметки
   */
  getNoteById(id: number): Promise<NoteDto>;

  /**
   * Создать новую заметку
   * @param noteData Данные заметки
   */
  createNote(noteData: Partial<NoteDto>): Promise<NoteDto>;

  /**
   * Обновить заметку
   * @param id ID заметки
   * @param noteData Новые данные заметки
   */
  updateNote(id: number, noteData: Partial<NoteDto>): Promise<NoteDto>;

  /**
   * Удалить заметку
   * @param id ID заметки
   */
  deleteNote(id: number): Promise<void>;

  /**
   * Получить заметки по ID пользователя
   * @param userId ID пользователя
   */
  getNotesByUserId(userId: number): Promise<NoteDto[]>;
}
