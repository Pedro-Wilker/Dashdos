import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const saltRounds = 10;

interface UpdatePasswordData {
  id: number;
  oldPassword: string;
  newPassword: string;
}

export class UpdatePasswordService {
  async execute({ id, oldPassword, newPassword }: UpdatePasswordData) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || !(await bcrypt.compare(oldPassword, user.passwordHash))) {
      throw new Error('Invalid old password');
    }

    const passwordHash = await bcrypt.hash(newPassword, saltRounds);
    await prisma.user.update({
      where: { id },
      data: { passwordHash },
    });

    return { message: 'Password updated' };
  }
}