import { Repository } from 'typeorm';
import { ShotEntity } from '../models/shot.entity';
import { CreateShotDto, ShotDto, UpdateShotDto } from '@app/dto';

export class ShotService {
  constructor(private shotRepository: Repository<ShotEntity>) {}

  async getShotById(id: number): Promise<ShotDto> {
    const shot = await this.shotRepository.findOne({
      where: { id },
    });
    if (!shot) {
      throw new Error('Выстрел не найден');
    }
    return this.mapToDto(shot);
  }

  async createShot(dto: CreateShotDto): Promise<ShotDto> {
    const shot = this.shotRepository.create({
      seriesId: dto.seriesId,
      order: dto.order,
      score: dto.score,
      x: dto.x,
      y: dto.y,
    });
    const savedShot = await this.shotRepository.save(shot);
    return this.mapToDto(savedShot);
  }

  async updateShot(id: number, dto: UpdateShotDto): Promise<ShotDto> {
    const shot = await this.shotRepository.findOne({
      where: { id },
    });
    if (!shot) {
      throw new Error('Выстрел не найден');
    }

    if (dto.order !== undefined) {
      shot.order = dto.order;
    }
    if (dto.score !== undefined) {
      shot.score = dto.score;
    }
    if (dto.x !== undefined) {
      shot.x = dto.x;
    }
    if (dto.y !== undefined) {
      shot.y = dto.y;
    }

    const updatedShot = await this.shotRepository.save(shot);
    return this.mapToDto(updatedShot);
  }

  async deleteShot(id: number): Promise<void> {
    const shot = await this.shotRepository.findOne({
      where: { id },
    });
    if (!shot) {
      throw new Error('Выстрел не найден');
    }
    await this.shotRepository.remove(shot);
  }

  async getShotsBySeriesId(seriesId: number): Promise<ShotDto[]> {
    const shots = await this.shotRepository.find({
      where: { seriesId },
    });
    return shots.map(shot => this.mapToDto(shot));
  }

  private mapToDto(shot: ShotEntity): ShotDto {
    return {
      id: shot.id,
      seriesId: shot.seriesId,
      order: shot.order,
      score: shot.score,
      x: shot.x,
      y: shot.y,
      createdAt: shot.createdAt,
      updatedAt: shot.updatedAt,
    };
  }
}
