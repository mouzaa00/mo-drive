import { and, eq, isNull } from "drizzle-orm";
import { db } from "~/db";
import { filesTable, foldersTable } from "~/db/schema";

export async function getAllParentsForFolder(folderId: string) {
  const parents = [];
  let currentId: string | null = folderId;
  while (currentId !== null) {
    const [folder] = await db
      .selectDistinct()
      .from(foldersTable)
      .where(eq(foldersTable.id, currentId));

    parents.unshift(folder);
    currentId = folder.parentId;
  }
  return parents;
}

export function getFolders(folderId: string) {
  return db
    .select()
    .from(foldersTable)
    .where(eq(foldersTable.parentId, folderId));
}

export function getFiles(folderId: string) {
  return db.select().from(filesTable).where(eq(filesTable.parentId, folderId));
}

export async function createFile(input: typeof filesTable.$inferInsert) {
  await db.insert(filesTable).values(input);
}

export async function getFolderById(folderId: string) {
  const [folder] = await db
    .select()
    .from(foldersTable)
    .where(eq(foldersTable.id, folderId));
  return folder;
}

export async function getRootFolderForUser(userId: string) {
  const [root] = await db
    .selectDistinct()
    .from(foldersTable)
    .where(
      and(eq(foldersTable.ownerId, userId), isNull(foldersTable.parentId)),
    );
  return root;
}

export async function onboardUser(userId: string) {
  const [rootFolder] = await db
    .insert(foldersTable)
    .values({
      name: "root",
      ownerId: userId,
      parentId: null,
    })
    .onConflictDoNothing()
    .returning();

  const root = rootFolder ?? (await getRootFolderForUser(userId));

  if (!root) {
    throw new Error(
      "Failed to onboard user: could not create or find root folder",
    );
  }

  await db
    .insert(foldersTable)
    .values([
      {
        name: "Documents",
        ownerId: userId,
        parentId: root.id,
      },
      {
        name: "Starred",
        ownerId: userId,
        parentId: root.id,
      },
      {
        name: "Photos",
        ownerId: userId,
        parentId: root.id,
      },
    ])
    .onConflictDoNothing();

  return root;
}
