import { PrismaClient } from '@prisma/client';

const resetCodes: { [email: string]: string } = {};

const prisma = new PrismaClient();

interface RequestResetData {
  email: string;
}

export class RequestResetPasswordService {
  async execute({ email }: RequestResetData) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }

    const code = Math.random().toString(36).substring(7);
    resetCodes[email] = code;

    console.log(`Código de reset enviado para ${email}: ${code}`);

    return { message: 'Reset code sent to email' };
  }
}

export { resetCodes };