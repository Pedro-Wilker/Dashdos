import { PrismaClient, Cargo } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const saltRounds = 10;

interface CreateUserData {
  email: string;
  name: string;
  cargo: Cargo;
  password: string;
}

export class CreateUserService {
  async execute({ email, name, cargo, password }: CreateUserData) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = await prisma.user.create({
      data: { email, name, cargo, passwordHash },
    });

    return { message: 'User created', userId: user.id };
  }
}