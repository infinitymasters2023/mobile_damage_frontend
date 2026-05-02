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
        signIn: "/login", // your custom login p
    },

    callbacks: {
        // ✅ Runs at login
        async signIn({ user, account, profile }) {
            console.log("USER:", user);
            console.log("ACCOUNT:", account);
            console.log("PROFILE:", profile);

            return true;
        },

        // ✅ Store extra data in JWT
        async jwt({ token, user }) {
            if (user) {
                token.name = user.name;
                token.email = user.email;
                token.picture = user.image;
            }
            return token;
        },

        // ✅ Send data to frontend
        async session({ session, token }) {
            if (token) {
                session.user = session.user || {}; // ✅ ensure object exists

                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.image = token.picture as string;
            }
            return session;
        },

        // ✅ Redirect after login
        async redirect({ baseUrl }) {
            return `${baseUrl}/Banking`;
        },
    },
});

export { handler as GET, handler as POST };