import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();
const userController = new UserController();

router.get('/me', async (_, res) => {
  try {
    const result = await userController.getMe();
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({
        message: error instanceof Error ? error.message : 'Ошибка сервера',
      });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await userController.getById(id);
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({
        message: error instanceof Error ? error.message : 'Ошибка сервера',
      });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await userController.update(id, req.body);
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({
        message: error instanceof Error ? error.message : 'Ошибка сервера',
      });
  }
});

router.post('/:id/delete', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await userController.delete(id);
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({
        message: error instanceof Error ? error.message : 'Ошибка сервера',
      });
  }
});

export const userRouter = router;
