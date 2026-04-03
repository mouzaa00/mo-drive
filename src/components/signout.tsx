"use client";

import { redirect } from "next/navigation";

import { authClient } from "~/lib/auth-client";

export default function SignOutButton() {
  return (
    <button
      onClick={async () =>
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              redirect("/");
            },
          },
        })
      }
    >
      Sign out
    </button>
  );
}
