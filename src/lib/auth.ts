import { betterAuth, User } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Resend } from "resend";

import { db } from "~/db";
import {
  accountsTable,
  sessionsTable,
  usersTable,
  verificationsTable,
} from "~/db/schema";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: usersTable,
      account: accountsTable,
      session: sessionsTable,
      verification: verificationsTable,
    },
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }: { user: User; url: string }) => {
      if (process.env.NODE_ENV === "development") {
        console.log(`[DEV] Reset password link for ${user.email}: ${url}`);
        return;
      }
      const { data, error } = await resend.emails.send({
        from: "FeedbackAI <onboarding@resend.dev>",
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
      console.log("Reset password email sent:", { data, error });
    },
    onPasswordReset: async ({ user }: { user: User }) => {
      console.log(`Password for user ${user.email} has been reset.`);
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      if (process.env.NODE_ENV === "development") {
        console.log(`[DEV] Verification link for ${user.email}: ${url}`);
        return;
      }
      const { data, error } = await resend.emails.send({
        from: "FeedbackAI <onboarding@resend.dev>",
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
      console.log("Verification email sent:", { data, error });
    },
    sendOnSignUp: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
