import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { env } from '../configs/env';

const migrationClient = postgres(env.DATABASE_URL, { max: 1 });

async function runMigrate() {
  console.log('⏳ Menjalankan migrasi database Drizzle...');
  const db = drizzle(migrationClient);
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('✅ Migrasi database berhasil diselesaikan.');
  await migrationClient.end();
  process.exit(0);
}

runMigrate().catch(async (err) => {
  console.error('❌ Migrasi database gagal:', err);
  await migrationClient.end();
  process.exit(1);
});
