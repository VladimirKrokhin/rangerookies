import { Router } from 'express';
import { Container } from 'typedi';
import { HealthController } from '../controllers/health.controller';

const router = Router();
const healthController = Container.get(HealthController);

router.get('/', (req, res) => healthController.check(req, res));

export default router;
