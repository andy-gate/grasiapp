import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getUserPermissions } from "@/lib/permissions";
import { findUserByLoginIdentifier } from "@/lib/username";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username: string;
      name: string;
      permissions: string[];
    };
  }

  interface User {
    username?: string;
    permissions?: string[];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    username: string;
    permissions: string[];
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/id/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        identifier: { label: "Email atau username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const identifier = credentials?.identifier as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!identifier || !password) return null;

        const user = await findUserByLoginIdentifier(identifier);
        if (!user?.passwordHash || !user.isActive) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        const permissions = await getUserPermissions(user.id);

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          name: user.name,
          permissions: Array.from(permissions),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.username = user.username ?? "";
        token.permissions = user.permissions ?? [];
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = (token.username as string) ?? "";
        session.user.permissions = (token.permissions as string[]) ?? [];
      }
      return session;
    },
  },
});
