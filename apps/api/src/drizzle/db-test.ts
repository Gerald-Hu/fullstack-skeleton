import { db } from './client';
import { sql } from 'drizzle-orm';

async function testConnection() {
  try {
    console.log('Attempting to connect with config:', {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      user: process.env.DB_USER || 'postgres',
      database: process.env.DB_NAME || 'fullstack_dev',
    });

    // Execute a simple query
    const result = await db.execute(sql`SELECT current_timestamp as time`);
    console.log('✅ Database connection successful!');
    console.log('Result:', result);
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error details:', error);
  } finally {
    process.exit();
  }
}

testConnection();
