import { timingSafeEqual } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { NextRequest } from 'next/server';
import { users } from '@/app/lib/placeholderdata';
import { getSql } from '@/app/lib/db';

function safeTokenMatches(expected: string, actual: string | null): boolean {
  if (!actual) {
    return false;
  }

  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(actual);

  return expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer);
}

function authorizeSeedRequest(request: NextRequest): boolean {
  if (process.env.NODE_ENV === 'production') {
    return false;
  }

  const seedToken = process.env.SEED_TOKEN;
  if (!seedToken) {
    return false;
  }

  return safeTokenMatches(seedToken, request.headers.get('x-seed-token'));
}

function getSeedPassword(): string {
  const password = process.env.SEED_USER_PASSWORD;
  if (!password || password.length < 12) {
    throw new Error('SEED_USER_PASSWORD must be at least 12 characters.');
  }

  return password;
}

async function seedUsers() {
  const sql = getSql();
  const seedPassword = getSeedPassword();

  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );
  `;

  return Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcrypt.hash(seedPassword, 12);
      return sql`
        INSERT INTO users (id, name, email, password)
        VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword})
        ON CONFLICT (id) DO NOTHING;
      `;
    }),
  );
}

export async function GET() {
  return Response.json(
    { error: 'Method not allowed.' },
    {
      status: 405,
      headers: { Allow: 'POST' },
    },
  );
}

export async function POST(request: NextRequest) {
  if (!authorizeSeedRequest(request)) {
    return Response.json({ error: 'Not found.' }, { status: 404 });
  }

  try {
    await seedUsers();
    return Response.json({ message: 'Database seeded successfully.' });
  } catch (error) {
    console.error('Database seed failed:', error instanceof Error ? error.message : 'Unknown error');
    return Response.json({ error: 'Database seed failed.' }, { status: 500 });
  }
}
