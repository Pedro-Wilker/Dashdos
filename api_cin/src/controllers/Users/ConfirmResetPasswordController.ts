import { Request, Response } from 'express';
import { ConfirmResetPasswordService } from '../../services/Users/ConfirmResetPasswordService';

export class ConfirmResetPasswordController {
  async handle(req: Request, res: Response) {
    const { email, code, newPassword } = req.body;
    const service = new ConfirmResetPasswordService();

    try {
      const result = await service.execute({ email, code, newPassword });
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}