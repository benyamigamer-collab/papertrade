import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      return Boolean(user?.email);
    },
    async session({ session }) {
      if (session.user?.email && process.env.ADMIN_EMAIL) {
        (session.user as { isAdmin?: boolean }).isAdmin = session.user.email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase();
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
