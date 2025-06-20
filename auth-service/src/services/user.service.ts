import { UserEntity } from '../models/user.entity';
import { AppDataSource } from '../config/database';
import { UserDto, CreateUserDto, UpdateUserDto } from '@app/dto';

export class UserService {
  private userRepository = AppDataSource.getRepository(UserEntity);

  private toDto(user: UserEntity): UserDto {
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      createdAt: user.created_at.toISOString(),
      updatedAt: user.updated_at.toISOString(),
    };
  }

  /**
   * Получить всех пользователей
   * @returns Массив пользователей
   */
  async getAll(): Promise<UserDto[]> {
    const users = await this.userRepository.find();
    return users.map(user => this.toDto(user));
  }

  /**
   * Получить пользователя по ID
   * @param id ID пользователя
   * @returns Данные пользователя
   */
  async getById(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    return this.toDto(user);
  }

  /**
   * Создать нового пользователя
   * @param userData Данные пользователя
   * @returns Созданный пользователь
   */
  async create(userData: CreateUserDto): Promise<UserDto> {
    const user = this.userRepository.create({
      email: userData.email,
    });
    const savedUser = await this.userRepository.save(user);
    return this.toDto(savedUser);
  }

  /**
   * Обновить данные пользователя
   * @param id ID пользователя
   * @param userData Новые данные пользователя
   * @returns Обновленный пользователь
   */
  async update(id: number, userData: UpdateUserDto): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    if (userData.email) user.email = userData.email;
    const updatedUser = await this.userRepository.save(user);
    return this.toDto(updatedUser);
  }

  /**
   * Удалить пользователя
   * @param id ID пользователя
   * @returns Результат операции
   */
  async delete(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    await this.userRepository.remove(user);
  }

  /**
   * Получить данные текущего пользователя
   * @returns Данные пользователя
   */
  async getMe(): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { id: 1 } }); // TODO: Get from request
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    return this.toDto(user);
  }
}
