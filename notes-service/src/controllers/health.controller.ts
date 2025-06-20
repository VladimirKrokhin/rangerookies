import { Service } from 'typedi';
import { dataSource } from '../config/database';
import { Response } from 'express';

@Service()
export class HealthController {
  async check(_: any, res: Response) {
    const isDbConnected = dataSource.isInitialized;
    return res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: isDbConnected ? 'connected' : 'disconnected',
      },
    });
  }
}
