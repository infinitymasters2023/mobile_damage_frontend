import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],

    pages: {
        signIn: "/login",
    },

    callbacks: {
        async signIn({ user, account, profile }) {
            console.log("USER:", user);
            console.log("ACCOUNT:", account);
            console.log("PROFILE:", profile);
            return true;
        },

        async jwt({ token, user }) {
            if (user) {
                token.name = user.name;
                token.email = user.email;
                token.picture = user.image;
            }
            return token;
        },

        async session({ session, token }) {
            if (token) {
                session.user = session.user || {};

                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.image = token.picture as string;
            }
            return session;
        },

        // ✅ FIXED redirect logic
        async redirect({ url, baseUrl }) {
            // allow /login or any relative route
            if (url.startsWith("/")) {
                return `${baseUrl}${url}`;
            }

            // allow full URLs from same origin
            if (url.startsWith(baseUrl)) {
                return url;
            }

            // default fallback
            return baseUrl;
        },
    },
});

export { handler as GET, handler as POST };