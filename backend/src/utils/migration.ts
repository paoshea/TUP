import prisma from '../config/database';

async function migrate() {
  try {
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS ...`; // Add your migration SQL here
    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrate();
