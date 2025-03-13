'server side'
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/definitions';
import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { SignupFormSchema, FormState } from '@/app/definitions'
import {users} from '@/app/lib/placeholderdata'
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

  
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
} 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          const passwordsMatch = await bcrypt.compare(password, user.password);
 
          if (passwordsMatch) return user;
        }
 
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});

export async function signUp(formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Correctly use `sql\`...\`` instead of `sql(...)`
    const data = await sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
      RETURNING id;
    `;

    const user = data[0];

    if (!user) {
      return { message: 'An error occurred while creating your account.' };
    }

    return { message: 'Account created successfully!', userId: user.id };
  } catch (error) {
    console.error('Signup error:', error);
    return { message: 'An error occurred while creating your account.' };
  }
}
