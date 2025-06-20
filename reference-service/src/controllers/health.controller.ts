import { JsonController, Get } from 'routing-controllers';
import { Service } from 'typedi';
import { dataSource } from '../config/database';

@Service()
@JsonController('/health')
export class HealthController {
  @Get()
  async check() {
    const isDbConnected = dataSource.isInitialized;
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: isDbConnected ? 'connected' : 'disconnected',
      },
    };
  }
}
