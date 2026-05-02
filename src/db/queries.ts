import { eq } from "drizzle-orm";
import { db } from "~/db";
import { filesTable, foldersTable } from "~/db/schema";

export async function getAllParentsForFolder(folderId: number) {
  const parents = [];
  let currentId: number | null = folderId;
  while (currentId !== null && currentId !== 1) {
    const [folder] = await db
      .selectDistinct()
      .from(foldersTable)
      .where(eq(foldersTable.id, currentId));

    if (!folder) {
      throw new Error("Parent folder not found");
    }
    parents.unshift(folder);
    currentId = folder.parentId;
  }
  return parents;
}

export function getFolders(folderId: number) {
  return db
    .select()
    .from(foldersTable)
    .where(eq(foldersTable.parentId, folderId));
}

export function getFiles(folderId: number) {
  return db.select().from(filesTable).where(eq(filesTable.parentId, folderId));
}
