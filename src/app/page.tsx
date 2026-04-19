import { headers } from "next/headers";
import Link from "next/link";
import { SignOut } from "~/components/sign-out";

import { auth } from "~/lib/auth";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {!session ? (
        <Link href={"/login"}>login</Link>
      ) : (
        <div className="flex flex-col">
          <span>{session.user.email}</span>
          <span>{session.user.name}</span>
          <SignOut />
        </div>
      )}
    </div>
  );
}

export async function UserOrgs() {
  return <div>Orgs</div>;
}
