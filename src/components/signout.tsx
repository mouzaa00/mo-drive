"use client";

import { authClient } from "~/lib/auth-client";

export default function SignOutButton() {
  return (
    <button onClick={async () => await authClient.signOut()}>Sign out</button>
  );
}
