import { Action } from 'routing-controllers';
import axios from 'axios';

export async function authorizationChecker(action: Action, _roles: string[]) {
  const authHeader = action.request.headers['authorization'];
  if (!authHeader) return false;
  const token = authHeader.split(' ')[1];
  if (!token) return false;

  try {
    // Проверяем токен через auth-service
    const response = await axios.post(
      'http://auth-service:8001/api/auth/validate-token',
      {
        token: token,
      },
    );

    if (response.data.valid && response.data.userId) {
      action.request.user = { id: response.data.userId };
      return true;
    }
    return false;
  } catch (error) {
    console.error('Ошибка при валидации токена:', error);
    return false;
  }
}
