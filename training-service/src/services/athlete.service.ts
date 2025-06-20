import { Repository } from 'typeorm';
import { AthleteEntity } from '../models/athlete.entity';
import { CreateAthleteDto, AthleteDto, UpdateAthleteDto } from '@app/dto';
import { CoachEntity } from '../models/coach.entity';
import { dataSource } from '../config/database';

export class AthleteService {
  constructor(private athleteRepository: Repository<AthleteEntity>) {}

  /**
   * Получить всех спортсменов
   * @returns Массив спортсменов
   */
  async getAllAthletes(): Promise<AthleteDto[]> {
    try {
      const athletes = await this.athleteRepository.find({
        relations: ['coaches'],
      });
      return athletes.map(this.mapToDto);
    } catch (error) {
      console.error('Ошибка при получении списка спортсменов:', error);
      throw error;
    }
  }

  /**
   * Получить спортсмена по ID
   * @param id ID спортсмена
   * @returns Данные спортсмена
   */
  async getAthleteById(id: number): Promise<AthleteDto> {
    try {
      const athlete = await this.athleteRepository.findOne({
        where: { id },
        relations: ['coaches'],
      });
      if (!athlete) {
        throw new Error('Спортсмен не найден');
      }
      return this.mapToDto(athlete);
    } catch (error) {
      console.error(`Ошибка при получении спортсмена ${id}:`, error);
      throw error;
    }
  }

  /**
   * Создать нового спортсмена
   * @param dto Данные спортсмена
   * @returns Созданный спортсмен
   */
  async createAthlete(dto: CreateAthleteDto): Promise<AthleteDto> {
    const athlete = this.athleteRepository.create({
      userId: dto.userId,
    });

    const savedAthlete = await this.athleteRepository.save(athlete);

    // Если указаны тренеры, связываем их
    if (dto.coachIds && dto.coachIds.length > 0) {
      const coachRepo = dataSource.getRepository(CoachEntity);
      const coaches = await coachRepo.findByIds(dto.coachIds);
      savedAthlete.coaches = coaches;
      await this.athleteRepository.save(savedAthlete);
    }

    return this.mapToDto(savedAthlete);
  }

  /**
   * Обновить спортсмена
   * @param id ID спортсмена
   * @param dto Новые данные спортсмена
   * @returns Обновленный спортсмен
   */
  async updateAthlete(id: number, dto: UpdateAthleteDto): Promise<AthleteDto> {
    try {
      const athlete = await this.athleteRepository.findOne({
        where: { id },
        relations: ['coaches'],
      });
      if (!athlete) {
        throw new Error('Спортсмен не найден');
      }
      if (dto.coachIds !== undefined) {
        const coachRepo = dataSource.getRepository(CoachEntity);
        athlete.coaches = await coachRepo.findByIds(dto.coachIds);
      }
      const updatedAthlete = await this.athleteRepository.save(athlete);
      return this.mapToDto(updatedAthlete);
    } catch (error) {
      console.error(`Ошибка при обновлении спортсмена ${id}:`, error);
      throw error;
    }
  }

  /**
   * Удалить спортсмена
   * @param id ID спортсмена
   */
  async deleteAthlete(id: number): Promise<void> {
    try {
      const athlete = await this.athleteRepository.findOne({
        where: { id },
      });
      if (!athlete) {
        throw new Error('Спортсмен не найден');
      }
      await this.athleteRepository.remove(athlete);
    } catch (error) {
      console.error('Ошибка при удалении спортсмена:', error);
      throw error;
    }
  }

  /**
   * Получить спортсмена по ID пользователя
   * @param userId ID пользователя
   * @returns Данные спортсмена
   */
  async getAthleteByUserId(userId: number): Promise<AthleteDto> {
    try {
      const athlete = await this.athleteRepository.findOne({
        where: { userId },
        relations: ['coaches'],
      });
      if (!athlete) {
        throw new Error(`Спортсмен с ID пользователя ${userId} не найден`);
      }
      return this.mapToDto(athlete);
    } catch (error) {
      console.error(
        `Ошибка при получении спортсмена по ID пользователя ${userId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Получить спортсменов по ID тренера
   * @param coachId ID тренера
   * @returns Массив спортсменов
   */
  async getAthletesByCoachId(coachId: number): Promise<AthleteDto[]> {
    try {
      const athletes = await this.athleteRepository.find({
        relations: ['coaches'],
      });
      return athletes
        .filter(athlete => athlete.coaches.some(coach => coach.id === coachId))
        .map(this.mapToDto);
    } catch (error) {
      console.error(
        `Ошибка при получении спортсменов тренера ${coachId}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Преобразовать сущность спортсмена в DTO
   * @param athlete Сущность спортсмена
   * @returns DTO спортсмена
   */
  private mapToDto(athlete: AthleteEntity): AthleteDto {
    return {
      id: athlete.id,
      userId: athlete.userId,
      coachIds: athlete.coaches?.map(coach => coach.id) || [],
      createdAt: athlete.created_at.toISOString(),
      updatedAt: athlete.updated_at.toISOString(),
    };
  }
}
