import {
  LoginResponseDto,
  RegisterDto,
  RegisterResponseDto,
  SuccessResponseDto,
} from '../auth.dto';

/**
 * Интерфейс сервиса аутентификации
 */
export interface IAuthService {
  /**
   * Аутентификация пользователя
   * @param email Email пользователя
   * @param password Пароль пользователя
   */
  login(
    email: string,
    password: string,
  ): Promise<LoginResponseDto | { message: string }>;

  /**
   * Регистрация нового пользователя
   * @param userData Данные пользователя
   */
  register(
    userData: RegisterDto,
  ): Promise<RegisterResponseDto | { message: string }>;

  /**
   * Изменение пароля пользователя
   * @param userId ID пользователя
   * @param oldPassword Текущий пароль
   * @param newPassword Новый пароль
   */
  changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<SuccessResponseDto | { message: string }>;

  /**
   * Проверка валидности токена
   * @param token JWT токен
   */
  validateToken(token: string): Promise<{ userId: number } | null>;
}
