import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { resetCodes } from './RequestResetPasswordService';

const prisma = new PrismaClient();
const saltRounds = 10;

interface ConfirmResetData {
  email: string;
  code: string;
  newPassword: string;
}

export class ConfirmResetPasswordService {
  async execute({ email, code, newPassword }: ConfirmResetData) {
    if (resetCodes[email] !== code) {
      throw new Error('Invalid code');
    }

    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    await prisma.user.update({
      where: { email },
      data: { passwordHash },
    });

    delete resetCodes[email];
    return { message: 'Password reset successful' };
  }
}