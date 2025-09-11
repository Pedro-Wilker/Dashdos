import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface AuthData {
  email: string;
  password: string;
}

export class AuthUserService {
  async execute({ email, password }: AuthData) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new Error('Credenciais Inválidas');
    }

    const token = jwt.sign(
      { id: user.id, cargo: user.cargo },
      process.env.JWT_SECRET as string,
      { expiresIn: '8h' } // Expiração em 8 horas
    );

    // Log para depuração
    console.log('Token gerado:', token);
    console.log('Expiração do token:', new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString());

    return { token, user: { id: user.id, name: user.name, cargo: user.cargo } };
  }
}