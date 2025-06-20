import { Router, Request, Response } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();
const userController = new UserController();

router.post('/change-password', (req: Request, res: Response) =>
  userController.changePassword(req, res),
);

export const userRouter = router;
