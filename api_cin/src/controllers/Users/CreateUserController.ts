import { Request, Response } from 'express';
import { Cargo } from '@prisma/client';
import { CreateUserService } from '../../services/Users/CreateUserService';

export class CreateUserController {
  async handle(req: Request, res: Response) {
    const { email, name, cargo, password } = req.body;
    if (!email || !name || !cargo || !password) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const service = new CreateUserService();

    try {
      const result = await service.execute({ email, name, cargo: cargo as Cargo, password });
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(409).json({ error: error.message });
    }
  }
}