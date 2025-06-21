import { Service } from 'typedi';
import { dataSource } from '../config/database';
import { Response } from 'express';
import { RabbitMQService } from '../services/rabbitmq.service';

@Service()
export class HealthController {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  async check(_: any, res: Response) {
    const isDbConnected = dataSource.isInitialized;
    const isRabbitConnected = this.rabbitMQService.isConnected();
    return res.json({
      status: isDbConnected && isRabbitConnected ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      services: {
        database: isDbConnected ? 'connected' : 'disconnected',
        rabbitmq: isRabbitConnected ? 'connected' : 'disconnected',
      },
    });
  }
}
