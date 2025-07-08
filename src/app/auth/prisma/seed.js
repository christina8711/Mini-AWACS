import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword1 = bcrypt.hashSync('password123', 10);
  const hashedPassword2 = bcrypt.hashSync('securepass456', 10);

  // First user
  await prisma.user.upsert({
    where: { email: 'testuser@gmail.com' },
    update: {},
    create: {
      email: 'testuser@gmail.com',
      password: hashedPassword1,
    },
  });

  // Second user
  await prisma.user.upsert({
    where: { email: 'newuser@example.com' },
    update: {},
    create: {
      email: 'newuser@example.com',
      password: hashedPassword2,
    },
  });

  console.log('Seed complete');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
