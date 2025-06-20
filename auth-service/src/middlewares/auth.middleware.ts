import { Response, NextFunction, Request } from 'express';
import { verify } from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { UserEntity } from '../models/user.entity';
import SETTINGS from '../config/settings';
import { UserDto } from '@app/dto';

interface RequestWithUser extends Request {
  user?: UserDto;
}

export const authMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Токен не указан' });
    }

    const decoded = verify(token, SETTINGS.JWT_SECRET_KEY) as {
      user: { id: number };
    };
    const userEntity = await AppDataSource.getRepository(UserEntity).findOne({
      where: { id: decoded.user.id },
      select: [
        'id',
        'username',
        'email',
        'first_name',
        'last_name',
        'created_at',
        'updated_at',
      ],
    });

    if (!userEntity) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    const user: UserDto = {
      id: userEntity.id,
      email: userEntity.email,
      firstName: userEntity.first_name || '',
      lastName: userEntity.last_name || '',
      createdAt: userEntity.created_at.toISOString(),
      updatedAt: userEntity.updated_at.toISOString(),
    };

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Неизвестный токен' });
  }
};
