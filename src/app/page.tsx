import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "~/lib/auth";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/organization/new");
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Link href={"/signup"}>Sign up</Link>
    </div>
  );
}
