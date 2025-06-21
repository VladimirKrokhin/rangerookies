import { JsonController, Get } from 'routing-controllers';
import { Service } from 'typedi';
import { AppDataSource } from '../config/database';
import { RabbitMQService } from '../services/rabbitmq.service';

@Service()
@JsonController('/health')
export class HealthController {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  @Get()
  async check() {
    console.log('HEALTH контроллер вызван');
    try {
      const isDbConnected = AppDataSource.isInitialized;
      const isRabbitConnected = this.rabbitMQService.isConnected();
      console.log('Состояние базы данных:', isDbConnected);
      console.log('Состояние RabbitMQ:', isRabbitConnected);
      return {
        status: isDbConnected && isRabbitConnected ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        services: {
          database: isDbConnected ? 'connected' : 'disconnected',
          rabbitmq: isRabbitConnected ? 'connected' : 'disconnected',
        },
      };
    } catch (error) {
      console.error('Ошибка проверки здоровья:', error);
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        services: {
          database: 'disconnected',
          rabbitmq: 'disconnected',
        },
        error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      };
    }
  }
}
