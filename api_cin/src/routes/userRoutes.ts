import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { CreateUserController } from '../controllers/Users/CreateUserController';
import { AuthUserController } from '../controllers/Users/AuthUserController';
import { UpdateUserController } from '../controllers/Users/UpdateUserController';
import { UpdatePasswordController } from '../controllers/Users/UpdatePasswordController';
import { RequestResetPasswordController } from '../controllers/Users/RequestResetPasswordController';
import { ConfirmResetPasswordController } from '../controllers/Users/ConfirmResetPasswordController';

const router = Router();

router.post('/users/register', new CreateUserController().handle);
router.post('/users/login', new AuthUserController().handle);
router.put('/users/:id', authMiddleware, new UpdateUserController().handle);
router.put('/users/:id/password', authMiddleware, new UpdatePasswordController().handle);
router.post('/users/reset-password/request', new RequestResetPasswordController().handle);
router.post('/users/reset-password/confirm', new ConfirmResetPasswordController().handle);

export default router;