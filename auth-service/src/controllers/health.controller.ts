import { Service } from 'typedi';
import { AppDataSource } from '../config/database';
import { Response } from 'express';

@Service()
export class HealthController {
  async check(_: any, res: Response) {
    try {
      const isConnected = AppDataSource.isInitialized;
      return res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        services: {
          database: isConnected ? 'connected' : 'disconnected',
        },
      });
    } catch (error) {
      return res.json({
        status: 'error',
        timestamp: new Date().toISOString(),
        services: {
          database: 'disconnected',
        },
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}
