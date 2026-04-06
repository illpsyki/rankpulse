import { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcryptjs"
import { prisma } from "./db"
import { PrismaAdapter as AuthPrismaAdapter } from "@auth/prisma-adapter"

export const authOptions: NextAuthOptions = {
  adapter: AuthPrismaAdapter(prisma) as any,
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-change-in-production",
  session: {
    strategy: "jwt",
    maxAge: 365 * 24 * 60 * 60, // 1 year
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text", optional: true },
        action: { label: "Action", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        const action = credentials.action || "login"

        if (action === "register") {
          const existing = await prisma.user.findUnique({
            where: { email: credentials.email },
          })
          if (existing) throw new Error("Email already registered")

          const hash = await bcrypt.hash(credentials.password, 10)
          const user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.name || null,
              passwordHash: hash,
            },
          })
          return { id: user.id, email: user.email, name: user.name }
        }

        // Login
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user) throw new Error("No account found with this email")

        const valid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!valid) throw new Error("Incorrect password")

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
  }
}
