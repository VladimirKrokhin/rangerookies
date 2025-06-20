import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

/**
 * Расширение интерфейса Request для включения данных пользователя
 */
interface RequestWithUser extends Request {
  user: any;
}

/**
 * Middleware для проверки аутентификации пользователя
 * @param request Запрос
 * @param response Ответ
 * @param next Функция для перехода к следующему middleware
 * @returns Ответ с ошибкой или переход к следующему middleware
 */
const authMiddleware = async (
  request: RequestWithUser,
  response: Response,
  next: NextFunction,
) => {
  const { headers } = request;
  const { authorization } = headers;

  if (!authorization) {
    return response
      .status(401)
      .send({ message: 'Не авторизован: токен не предоставлен' });
  }

  try {
    const [, accessToken] = authorization.split(' ');

    if (!accessToken) {
      return response
        .status(401)
        .send({ message: 'Не авторизован: токен не предоставлен' });
    }

    // Проверка токена через сервис аутентификации
    const authServiceUrl =
      process.env.AUTH_SERVICE_URL || 'http://auth-service:8001';
    const validateResponse = await axios.post(
      `${authServiceUrl}/api/auth/validate-token`,
      {
        token: accessToken,
      },
    );

    if (!validateResponse.data.valid) {
      return response.status(403).send({
        message: 'Доступ запрещен: токен недействителен или истек',
      });
    }

    // Устанавливаем ID пользователя из ответа сервиса аутентификации
    request.user = { id: validateResponse.data.userId };

    next();
  } catch (error) {
    console.error('Ошибка проверки токена:', error);

    return response.status(403).send({
      message: 'Доступ запрещен: ошибка проверки токена',
    });
  }
};

export { RequestWithUser };

export default authMiddleware;
