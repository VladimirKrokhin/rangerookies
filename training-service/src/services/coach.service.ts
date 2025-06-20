import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { CoachEntity } from '../models/coach.entity';
import { CreateCoachDto, CoachDto, UpdateCoachDto } from '@app/dto';
import { dataSource } from '../config/database';
import { AthleteEntity } from '../models/athlete.entity';
import { In } from 'typeorm';
import { BadRequestError } from 'routing-controllers';

@Service()
export class CoachService {
  private coachRepository: Repository<CoachEntity>;

  constructor() {
    this.coachRepository = dataSource.getRepository(CoachEntity);
  }

  /**
   * Получить всех тренеров
   * @returns Массив тренеров
   */
  async getAllCoaches(): Promise<CoachDto[]> {
    try {
      const coaches = await this.coachRepository.find({ relations: ['athletes'] });
      return coaches.map(this.mapToDto);
    } catch (error) {
      console.error('Ошибка при получении списка тренеров:', error);
      throw error;
    }
  }

  /**
   * Получить тренера по ID
   * @param id ID тренера
   * @returns Данные тренера
   */
  async getCoachById(id: number): Promise<CoachDto> {
    try {
      const coach = await this.coachRepository.findOne({
        where: { id },
        relations: ['athletes'],
      });
      if (!coach) {
        throw new Error(`Тренер с ID ${id} не найден`);
      }
      return this.mapToDto(coach);
    } catch (error) {
      console.error(`Ошибка при получении тренера ${id}:`, error);
      throw error;
    }
  }

  /**
   * Создать нового тренера
   * @param dto Данные тренера
   * @returns Созданный тренер
   */
  async createCoach(dto: CreateCoachDto): Promise<CoachDto> {
    try {
      console.log('--- [createCoach] DTO:', dto);
      console.log('--- [createCoach] dataSource.entities:', dataSource.options.entities);
      const coach = this.coachRepository.create({ userId: dto.userId });
      const savedCoach = await this.coachRepository.save(coach);
      console.log('--- [createCoach] savedCoach:', savedCoach);
      if (dto.athleteIds && dto.athleteIds.length > 0) {
        const athleteRepo = dataSource.getRepository(AthleteEntity);
        const athletes = await athleteRepo.findByIds(dto.athleteIds);
        console.log('--- [createCoach] athletes:', athletes);
        savedCoach.athletes = athletes;
        await this.coachRepository.save(savedCoach);
      }
      return this.mapToDto(savedCoach);
    } catch (error) {
      console.error('--- [createCoach] ERROR:', error);
      throw new BadRequestError('Не удалось создать тренера');
    }
  }

  /**
   * Удалить тренера
   * @param id ID тренера
   */
  async deleteCoach(id: number): Promise<void> {
    try {
      const coach = await this.coachRepository.findOne({
        where: { id },
      });
      if (!coach) {
        throw new Error('Тренер не найден');
      }
      await this.coachRepository.remove(coach);
    } catch (error) {
      console.error(`Ошибка при удалении тренера ${id}:`, error);
      throw error;
    }
  }

  /**
   * Получить тренера по ID пользователя
   * @param userId ID пользователя
   * @returns Данные тренера
   */
  async getCoachByUserId(userId: number): Promise<CoachDto> {
    try {
      const coach = await this.coachRepository.findOne({
        where: { userId },
        relations: ['athletes'],
      });
      if (!coach) {
        throw new Error(`Тренер для пользователя ${userId} не найден`);
      }
      return this.mapToDto(coach);
    } catch (error) {
      console.error(
        `Ошибка при получении тренера для пользователя ${userId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Преобразовать сущность тренера в DTO
   * @param coach Сущность тренера
   * @returns DTO тренера
   */
  private mapToDto(coach: CoachEntity): CoachDto {
    return {
      id: coach.id,
      userId: coach.userId,
      athleteIds: coach.athletes?.map(a => a.id) || [],
      createdAt: coach.created_at.toISOString(),
      updatedAt: coach.updated_at.toISOString(),
    };
  }

  /**
   * Обновить данные тренера
   * @param id ID тренера
   * @param dto Данные для обновления
   * @returns Обновленный тренер
   */
  async updateCoach(id: number, dto: UpdateCoachDto): Promise<CoachDto> {
    try {
      const coach = await this.coachRepository.findOne({
        where: { id },
        relations: ['athletes'],
      });
      if (!coach) {
        throw new Error('Тренер не найден');
      }

      // Если обновляются athleteIds, обновляем связь
      if (dto.athleteIds !== undefined) {
        const athleteRepo = dataSource.getRepository(AthleteEntity);
        coach.athletes = await athleteRepo.find({ where: { id: In(dto.athleteIds) } });
        await this.coachRepository.save(coach);
      }

      // Повторно загружаем тренера с подгруженными связями
      const updatedCoach = await this.coachRepository.findOne({
        where: { id },
        relations: ['athletes'],
      });
      return this.mapToDto(updatedCoach!);
    } catch (error) {
      console.error(`Ошибка при обновлении тренера ${id}:`, error);
      throw error;
    }
  }
}
