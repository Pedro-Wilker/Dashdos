import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface UpdateUserData {
  id: number;
  name?: string;
  email?: string;
}

export class UpdateUserService {
  async execute({ id, name, email }: UpdateUserData) {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email },
    });
    return updatedUser;
  }
}