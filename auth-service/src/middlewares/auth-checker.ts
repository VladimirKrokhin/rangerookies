import { Action } from 'routing-controllers';
import Container from 'typedi';
import { AuthService } from '../services/auth.service';

// В этом приложении роли не используются, но routing-controllers всегда передаёт второй аргумент
export async function authorizationChecker(action: Action, roles?: string[]) {
  console.log('ВЫЗВАН AUTH CHECKER для URL:', action.request.url);
  console.log('РОЛИ AUTH CHECKER:', roles);
  
  // Специальная проверка для health-эндпоинта
  if (action.request.url.includes('/api/health')) {
    console.log('Пропускаем проверку для health-эндпоинта');
    return true;
  }
  
  // Если roles не переданы или пусты, значит метод не помечен @Authorized() — пропускаем авторизацию
  if (!roles || roles.length === 0) {
    console.log('Нет декоратора @Authorized() - пропускаем авторизацию');
    return true;
  }
  
  const authHeader = action.request.headers['authorization'];
  if (!authHeader) {
    console.log('Заголовок авторизации не найден');
    return false;
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('Токен не найден в заголовке');
    return false;
  }
  const authService = Container.get(AuthService);
  try {
    const result = await authService.validateToken(token);
    if (result && result.userId) {
      action.request.user = { id: result.userId };
      console.log('Авторизация успешна для пользователя:', result.userId);
      return true;
    }
    console.log('Проверка токена не удалась');
    return false;
  } catch (error) {
    console.log('Ошибка авторизации:', error);
    return false;
  }
}
