import {
  Param,
  Body,
  Get,
  Post,
  Patch,
  UseBefore,
  JsonController,
  HttpCode,
  NotFoundError,
  BadRequestError,
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { Response, Request } from 'express';

import { UserService } from '../services/user.service';
import { authMiddleware } from '../middlewares/auth.middleware';
import {
  CreateUserDto,
  UpdateUserDto,
  UserDto,
  ChangePasswordDto,
} from '@app/dto';
import { AuthService } from '../services/auth.service';
import { RabbitMQService } from '../services/rabbitmq.service';

interface RequestWithUser extends Request {
  user?: UserDto;
}

@JsonController()
export class UserController {
  private userService: UserService;
  private authService: AuthService;
  private rabbitMQService: RabbitMQService;

  constructor() {
    this.userService = new UserService();
    this.authService = new AuthService();
    this.rabbitMQService = new RabbitMQService();
  }

  /**
   * Получить всех пользователей
   * @returns Список пользователей
   */
  @Get('/')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Получить всех пользователей' })
  @ResponseSchema(UserDto, { isArray: true })
  async getAll() {
    try {
      return await this.userService.getAll();
    } catch (error) {
      console.error('Ошибка при получении списка пользователей:', error);
      throw new BadRequestError('Ошибка при получении списка пользователей');
    }
  }

  /**
   * Создать пользователя
   * @param dto Данные для создания пользователя
   * @returns Созданный пользователь
   */
  @Post('/')
  @HttpCode(201)
  @OpenAPI({
    summary: 'Создать пользователя',
    security: [], // Отключаем требование авторизации для регистрации
  })
  @ResponseSchema(UserDto)
  async create(@Body({ validate: true }) dto: CreateUserDto) {
    try {
      const user = await this.userService.create(dto);
      await this.rabbitMQService.publishUserCreated(user.id.toString());
      return user;
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error);
      throw new BadRequestError(
        error instanceof Error
          ? error.message
          : 'Ошибка при создании пользователя',
      );
    }
  }

  /**
   * Получить пользователя по ID
   * @param id ID пользователя
   * @returns Данные пользователя
   */
  @Get('/:id')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Получить пользователя по id' })
  @ResponseSchema(UserDto)
  async getById(@Param('id') id: number) {
    try {
      const user = await this.userService.getById(id);
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
      return user;
    } catch (error) {
      console.error(`Ошибка при получении пользователя с id ${id}:`, error);
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new BadRequestError('Ошибка при получении пользователя');
    }
  }

  /**
   * Обновить пользователя
   * @param id ID пользователя
   * @param dto Новые данные пользователя
   * @returns Обновленный пользователь
   */
  @Patch('/:id')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Обновить пользователя' })
  @ResponseSchema(UserDto)
  async update(
    @Param('id') id: number,
    @Body({ validate: true }) dto: UpdateUserDto,
  ) {
    try {
      const user = await this.userService.update(id, dto);
      await this.rabbitMQService.publishUserUpdated(user.id.toString());
      return user;
    } catch (error) {
      console.error(`Ошибка при обновлении пользователя ${id}:`, error);
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new BadRequestError(
        error instanceof Error
          ? error.message
          : 'Ошибка при обновлении пользователя',
      );
    }
  }

  /**
   * Удалить пользователя
   * @param id ID пользователя
   * @returns Результат операции
   */
  @Post('/:id/delete')
  @UseBefore(authMiddleware)
  @OpenAPI({ summary: 'Удалить пользователя' })
  async delete(@Param('id') id: number) {
    try {
      const result = await this.userService.delete(id);
      await this.rabbitMQService.publishUserDeleted(id.toString());
      return result;
    } catch (error) {
      console.error(`Ошибка при удалении пользователя ${id}:`, error);
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new BadRequestError('Ошибка при удалении пользователя');
    }
  }

  /**
   * Получить информацию о текущем пользователе
   * @returns Данные текущего пользователя
   */
  @Get('/me')
  async getMe(): Promise<UserDto> {
    return this.userService.getMe();
  }

  /**
   * Изменить пароль пользователя
   * @param req Запрос с данными пользователя
   * @param res Ответ
   * @returns Результат операции
   */
  changePassword = async (
    req: RequestWithUser,
    res: Response,
  ): Promise<Response> => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Пользователь не авторизован' });
      }

      const { currentPassword, newPassword }: ChangePasswordDto = req.body;
      const userId = req.user.id;

      const result = await this.authService.changePassword(
        userId,
        currentPassword,
        newPassword,
      );

      if ('message' in result) {
        return res.status(400).json(result);
      }

      await this.rabbitMQService.publishUserUpdated(userId.toString());
      return res.json(result);
    } catch (error) {
      console.error('Ошибка при смене пароля:', error);
      return res.status(500).json({ message: 'Ошибка при смене пароля' });
    }
  };
}
