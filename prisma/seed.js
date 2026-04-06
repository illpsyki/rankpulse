const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hash = bcrypt.hashSync('demo1234', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@rankpulse.io' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@rankpulse.io',
      passwordHash: hash,
    },
  });

  console.log(`Created demo user: ${user.email} (password: demo1234)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
