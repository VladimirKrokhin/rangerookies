import { JsonController, Get } from 'routing-controllers';
import { Service } from 'typedi';
import { dataSource } from '../config/database';

@Service()
@JsonController('/health')
export class HealthController {
  @Get()
  async check() {
    try {
      const isDbConnected =
        dataSource.isInitialized && (await dataSource.query('SELECT 1'));
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
          database: isDbConnected ? 'connected' : 'disconnected',
        },
      };
    } catch (error: any) {
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        services: {
          database: 'disconnected',
        },
        error: error.message,
      };
    }
  }
}
