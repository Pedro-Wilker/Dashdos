import { Request, Response } from 'express';
import { UpdateUserService } from '../../services/Users/UpdateUserService';
import { AuthRequest } from '../../middlewares/auth';

export class UpdateUserController {
  async handle(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { name, email } = req.body;
    const userId = req.user?.id;

    if (userId !== parseInt(id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const service = new UpdateUserService();

    try {
      const result = await service.execute({ id: parseInt(id), name, email });
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}