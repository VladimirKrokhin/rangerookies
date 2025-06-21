import { JsonController, Get } from 'routing-controllers';
import { Service } from 'typedi';
import { dataSource } from '../config/database';
import { RabbitMQService } from '../services/rabbitmq.service';

@Service()
@JsonController('/health')
export class HealthController {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  @Get()
  async check() {
    try {
      const isDbConnected =
        dataSource.isInitialized && (await dataSource.query('SELECT 1'));
      const isRabbitConnected = this.rabbitMQService.isConnected();
      return {
        status: isDbConnected && isRabbitConnected ? 'ok' : 'degraded',
        timestamp: new Date().toISOString(),
        services: {
          database: isDbConnected ? 'connected' : 'disconnected',
          rabbitmq: isRabbitConnected ? 'connected' : 'disconnected',
        },
      };
    } catch (error: any) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        services: {
          database: 'disconnected',
          rabbitmq: 'disconnected',
        },
        error: error.message,
      };
    }
  }
}
