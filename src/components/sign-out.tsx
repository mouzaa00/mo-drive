"use client";

import { authClient } from "~/lib/auth-client";
import { Button } from "./ui/button";

export function SignOut() {
  return (
    <Button variant="outline" onClick={async () => await authClient.signOut()}>
      sign out
    </Button>
  );
}
