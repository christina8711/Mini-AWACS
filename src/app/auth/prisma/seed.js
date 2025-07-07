import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = bcrypt.hashSync('password123', 10);

  await prisma.user.upsert({
    where: { email: 'testuser@gmail.com' },
    update: {},
    create: {
      email: 'testuser@gmail.com',
      password: hashedPassword,
    },
  });

  console.log('Seed complete');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());