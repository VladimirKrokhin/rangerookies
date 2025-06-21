import { JsonController, Get } from 'routing-controllers';
import { Service } from 'typedi';
import { AppDataSource } from '../config/database';

@Service()
@JsonController('/health')
export class HealthController {
  @Get()
  async check() {
    console.log('HEALTH контроллер вызван');
    try {
      const isConnected = AppDataSource.isInitialized;
      console.log('Состояние базы данных:', isConnected);
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
          database: isConnected ? 'connected' : 'disconnected',
        },
      };
    } catch (error) {
      console.error('Ошибка проверки здоровья:', error);
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        services: {
          database: 'disconnected',
        },
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      };
    }
  }
}
