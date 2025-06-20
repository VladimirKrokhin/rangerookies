import { Get, JsonController } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Service } from 'typedi';
import { AppDataSource } from '../config/database';

@JsonController('/auth')
@Service()
export class HealthController {
  @Get('/health')
  @OpenAPI({
    summary: 'Health check',
    description: 'Проверка работоспособности сервиса',
    security: [], // Отключаем требование авторизации для этого эндпоинта
  })
  public async check() {
    try {
      const isConnected = AppDataSource.isInitialized;
      return {
        status: 'ok',
        database: isConnected ? 'connected' : 'disconnected',
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Service is not healthy',
      };
    }
  }
}
