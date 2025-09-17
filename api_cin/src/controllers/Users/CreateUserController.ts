import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { BaseController } from '../BaseController';
import logger from '../../lib/logger'; 

const prisma = new PrismaClient();

export class CreateUserController {
  async handle(req: Request, res: Response) {
    const schema = z.object({
      email: z.string().email('Email inválido'),
      name: z.string().min(1, 'Nome é obrigatório'),
      password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
      cargo: z.enum([
        'ADMIN', 'DIRETORIA', 'SAC', 'CARTA', 'ARTICULACAO', 'NGA',
        'PONTOS', 'CAPITAL', 'INTERIOR', 'NUD', 'MOVEL', 'CIN'
      ], { errorMap: () => ({ message: 'Cargo inválido' }) })
    });

    try {
      const { email, name, password, cargo } = schema.parse(req.body);
      const passwordHash = await bcrypt.hash(password, 12);

      const user = await prisma.user.create({
        data: { email, name, passwordHash, cargo }
      });

      return res.status(201).json({
        data: { id: user.id, email: user.email, name: user.name, cargo: user.cargo },
        meta: {}
      });
    } catch (e: any) {
      logger.error('Create user error', { error: e.message, stack: e.stack });
      return res.status(e instanceof z.ZodError ? 400 : 500).json({
        error: { code: e instanceof z.ZodError ? 'VALIDATION_ERROR' : 'INTERNAL_SERVER_ERROR', message: e.message }
      });
    }
  }
}