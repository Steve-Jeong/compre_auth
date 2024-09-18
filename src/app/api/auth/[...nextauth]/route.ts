import { prisma } from "@/lib/prisma";
import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import chalk from "chalk";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: {
          label: "email",
          type: "text",
          placeholder: "Enter your@email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
        rememberMe: { label: "Remember Me", type: "checkbox" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.username,
          },
        });
        if (!user) throw new Error("Username or password is not correct");
        if (!credentials?.password)
          throw new Error("Username or password is not correct");
        // const isPasswordCorrect = await bcrypt.compare(
        //   credentials.password,
        //   user.password
        // );
        const isPasswordCorrect = credentials.password === user.password;
        if (!isPasswordCorrect)
          throw new Error("Username or password is not correct");
        const { password, ...userWithoutPassword } = user;
        console.log(chalk.bgYellow.yellowBright('userWithoutPassword :'), userWithoutPassword)
        return userWithoutPassword;
      },
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
