import { JsonController, Get } from 'routing-controllers';
import { Service } from 'typedi';
import { AppDataSource } from '../config/database';

@Service()
@JsonController('/health')
export class HealthController {
  @Get()
  async check() {
    try {
      const isConnected = AppDataSource.isInitialized;
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
          database: isConnected ? 'connected' : 'disconnected',
        },
      };
    } catch (error) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        services: {
          database: 'disconnected',
        },
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
