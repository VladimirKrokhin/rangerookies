import { Action } from 'routing-controllers';
import Container from 'typedi';
import { AuthService } from '../services/auth.service';

export async function authorizationChecker(action: Action, _roles: string[]) {
  const authHeader = action.request.headers['authorization'];
  if (!authHeader) return false;
  const token = authHeader.split(' ')[1];
  if (!token) return false;
  const authService = Container.get(AuthService);
  try {
    const result = await authService.validateToken(token);
    if (result && result.userId) {
      action.request.user = { id: result.userId };
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
