"use client";

import { authClient } from "~/lib/auth-client";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";

export function SignOut() {
  return (
    <Button
      variant="outline"
      onClick={async () =>
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              redirect("/login");
            },
          },
        })
      }
    >
      sign out
    </Button>
  );
}
