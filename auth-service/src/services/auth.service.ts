import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import SETTINGS from '../config/settings';
import { UserEntity } from '../models/user.entity';
import {
  IAuthService,
  LoginResponseDto,
  RegisterDto,
  RegisterResponseDto,
  SuccessResponseDto,
} from '@app/dto';
import { Service } from 'typedi';

@Service()
export class AuthService implements IAuthService {
  private userRepository: Repository<UserEntity>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(UserEntity);
  }

  /**
   * Аутентификация пользователя
   * @param email Email пользователя
   * @param password Пароль пользователя
   * @returns Объект с токеном доступа или сообщение об ошибке
   */
  async login(
    email: string,
    password: string,
  ): Promise<LoginResponseDto | { message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return { message: 'Пользователь не найден' };
    }

    const isPasswordValid = await this.validatePassword(
      password,
      user.password_hash,
    );
    if (!isPasswordValid) {
      return { message: 'Неверный пароль' };
    }

    const accessToken = this.generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
      },
      token: accessToken,
    };
  }

  /**
   * Регистрация нового пользователя
   * @param userData Данные пользователя для регистрации
   * @returns Объект с данными созданного пользователя и токеном или сообщение об ошибке
   */
  async register(
    userData: RegisterDto,
  ): Promise<RegisterResponseDto | { message: string }> {
    const existingUser = await this.userRepository.findOne({
      where: [{ email: userData.email }],
    });

    if (existingUser) {
      return {
        message: 'Пользователь с таким email или username уже существует',
      };
    }

    const hashedPassword = await this.hashPassword(userData.password);

    const user = this.userRepository.create({
      username: userData.username,
      email: userData.email,
      password_hash: hashedPassword,
      first_name: userData.firstName,
      last_name: userData.lastName,
    });

    await this.userRepository.save(user);

    const accessToken = this.generateToken(user);

    return {
      token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
      },
    };
  }

  /**
   * Изменение пароля пользователя
   * @param userId ID пользователя
   * @param oldPassword Текущий пароль
   * @param newPassword Новый пароль
   * @returns Объект с результатом операции
   */
  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<SuccessResponseDto | { message: string }> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        return { message: 'Пользователь не найден' };
      }

      const isPasswordValid = await compare(oldPassword, user.password_hash);
      if (!isPasswordValid) {
        return { message: 'Неверный старый пароль' };
      }

      const hashedPassword = await hash(newPassword, 10);
      user.password_hash = hashedPassword;
      await this.userRepository.save(user);

      return { message: 'Пароль успешно изменен' };
    } catch (error) {
      console.error('Ошибка при изменении пароля:', error);
      return { message: 'Ошибка при изменении пароля' };
    }
  }

  /**
   * Проверка валидности JWT токена
   * @param token JWT токен для проверки
   * @returns Объект с ID пользователя или null, если токен недействителен
   */
  async validateToken(token: string): Promise<{ userId: number } | null> {
    try {
      const decoded = verify(token, SETTINGS.JWT_SECRET_KEY) as {
        userId: number;
      };
      return decoded;
    } catch (error) {
      return null;
    }
  }

  private async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  private generateToken(user: UserEntity): string {
    return sign({ userId: user.id }, SETTINGS.JWT_SECRET_KEY, {
      expiresIn: '1h',
    });
  }

  private async hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }
}
