import { headers } from "next/headers";
import Link from "next/link";
import SignOutButton from "~/components/signout";
import { auth } from "~/lib/auth";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {session ? (
        <div>
          <h1>Welcome {session.user.name}</h1>
          <SignOutButton />
        </div>
      ) : (
        <Link href={"/signup"}>Sign up</Link>
      )}
    </div>
  );
}
