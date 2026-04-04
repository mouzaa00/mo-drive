"use client";

import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";

export default function VerifyEmail({ email }: { email: string }) {
  const sendEmail = async () => {
    console.log("Resend verification email");
    await authClient.sendVerificationEmail({ email, callbackURL: "/" });
  };

  return (
    <div>
      <p>Please verify your email address to access all features.</p>
      <Button onClick={sendEmail}>Resend Verification Email</Button>
    </div>
  );
}
