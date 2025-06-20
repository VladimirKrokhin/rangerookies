import { Action } from 'routing-controllers';
import axios from 'axios';

export async function authorizationChecker(action: Action, _roles: string[]) {
  // Пропускаем авторизацию для health endpoint
  if (action.request.url.startsWith('/api/health')) {
    return true;
  }

  const authHeader = action.request.headers['authorization'];
  console.log('Заголовок авторизации:', authHeader);

  if (!authHeader) {
    console.log('Заголовок авторизации не найден');
    return false;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('Токен не найден в заголовке');
    return false;
  }

  console.log('Получен токен:', token.substring(0, 20) + '...');

  try {
    console.log('Вызов auth-service...');
    const response = await axios.post(
      'http://auth-service:8001/api/auth/validate-token',
      {
        token: token,
      },
    );

    console.log('Ответ auth-service:', response.data);

    if (response.data.valid && response.data.userId) {
      action.request.user = { id: response.data.userId };
      console.log(
        'Авторизация успешна для пользователя:',
        response.data.userId,
      );
      return true;
    }

    console.log('Не удалось проверить токен');
    return false;
  } catch (error) {
    console.error('Ошибка при проверке токена:', error);
    return false;
  }
}
