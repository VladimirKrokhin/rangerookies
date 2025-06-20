import { Request } from 'express';
import { UserDto } from '../user.dto';

/**
 * Расширенный интерфейс запроса с пользователем
 */
export interface RequestWithUser extends Request {
  user?: UserDto;
}
