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
    const isDbConnected = dataSource.isInitialized;
    const isRabbitConnected = this.rabbitMQService.isConnected();
    return {
      status: isDbConnected && isRabbitConnected ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        database: isDbConnected ? 'connected' : 'disconnected',
        rabbitmq: isRabbitConnected ? 'connected' : 'disconnected',
      },
    };
  }
}
