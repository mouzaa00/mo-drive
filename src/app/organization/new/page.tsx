import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { CreateOrganizationForm } from "~/components/create-organization-form";
import { auth } from "~/lib/auth";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <CreateOrganizationForm />
      </div>
    </div>
  );
}
