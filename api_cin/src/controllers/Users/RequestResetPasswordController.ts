import { Request, Response } from 'express';
import { RequestResetPasswordService } from '../../services/Users/RequestResetPasswordService';

export class RequestResetPasswordController {
  async handle(req: Request, res: Response) {
    const { email } = req.body;
    const service = new RequestResetPasswordService();

    try {
      const result = await service.execute({ email });
      return res.json(result);
    } catch (error: any) {
      return res.status(404).json({ error: error.message });
    }
  }
}