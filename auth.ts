import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import { sql, QueryResultRow } from '@vercel/postgres';
import { z } from 'zod';

// Type-safe query function
async function query<T extends QueryResultRow>(
    strings: TemplateStringsArray,
    ...values: any[]
): Promise<T[]> {
    const result = await sql<T>(strings, ...values);
    return result as unknown as T[];
}

async function getUser(email: string): Promise<User | undefined> {
    try {
        const users = await query<User>`SELECT * FROM users WHERE email=${email}`;
        return users[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [Credentials({
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

        }
    })],
});