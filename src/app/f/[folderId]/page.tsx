import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { FileBrowser } from "./file-browser";
import { SignOut } from "~/components/sign-out";
import { auth } from "~/lib/auth";
import { db } from "~/db";
import { filesTable, foldersTable } from "~/db/schema";

export default async function DrivePage({
  params,
}: {
  params: Promise<{ folderId: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const { folderId } = await params;
  const parsedFolderId = parseInt(folderId);
  if (isNaN(parsedFolderId)) {
    return <div>Not a valid folder id</div>;
  }

  const folders = await db
    .select()
    .from(foldersTable)
    .where(eq(foldersTable.parentId, parsedFolderId));
  const files = await db
    .select()
    .from(filesTable)
    .where(eq(filesTable.parentId, parsedFolderId));

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-600 text-white" />
          <h1 className="text-xl font-medium text-gray-700">My Drive</h1>
        </div>
        <SignOut />
      </header>
      <main className="w-full max-w-none p-6">
        <FileBrowser folders={folders} files={files} />
      </main>
    </div>
  );
}
