import { Request, Response } from 'express';
import { UpdatePasswordService } from '../../services/Users/UpdatePasswordService';
import { AuthRequest } from '../../middlewares/auth';

export class UpdatePasswordController {
  async handle(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (userId !== parseInt(id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const service = new UpdatePasswordService();

    try {
      const result = await service.execute({ id: parseInt(id), oldPassword, newPassword });
      return res.json(result);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }
}