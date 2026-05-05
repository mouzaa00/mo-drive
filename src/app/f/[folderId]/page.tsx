import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { FileBrowser } from "./file-browser";
import { SignOut } from "~/components/sign-out";
import { auth } from "~/lib/auth";
import {
  getAllParentsForFolder,
  getFiles,
  getFolderById,
  getFolders,
} from "~/db/queries";

export default async function DrivePage({
  params,
}: {
  params: Promise<{ folderId: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const { folderId } = await params;

  const folder = await getFolderById(folderId);
  if (!folder || folder.ownerId !== session.user.id) {
    return <div>Unauthorized</div>;
  }

  const [folders, files, parents] = await Promise.all([
    getFolders(folderId),
    getFiles(folderId),
    getAllParentsForFolder(folderId),
  ]);

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
        <FileBrowser
          folders={folders}
          files={files}
          parents={parents}
          currentFolderId={folderId}
        />
      </main>
    </div>
  );
}
