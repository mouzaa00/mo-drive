import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getRootFolderForUser, onboardUser } from "~/db/queries";
import { auth } from "~/lib/auth";
import { OnboardingButton } from "~/components/onboarding-button";

export default async function DrivePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/login");
  }

  const root = await getRootFolderForUser(session.user.id);

  if (root) {
    return redirect(`/f/${root.id}`);
  }

  return (
    <div className="h-screen bg-linear-to-b from-white to-gray-100 flex items-center justify-center">
      <form
        action={async () => {
          "use server";

          const rootFolder = await onboardUser(session.user.id);
          redirect(`/f/${rootFolder.id}`);
        }}
      >
        <OnboardingButton />
      </form>
    </div>
  );
}
