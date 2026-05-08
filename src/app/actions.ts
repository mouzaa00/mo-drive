"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { UTApi } from "uploadthing/server";
import { db } from "~/db";
import { filesTable, foldersTable } from "~/db/schema";
import { auth } from "~/lib/auth";

const utApi = new UTApi();

export async function deleteFile(fileId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const [file] = await db
    .selectDistinct()
    .from(filesTable)
    .where(eq(filesTable.id, fileId));

  if (!file) {
    return { error: "File not found" };
  }

  if (file.ownerId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  await utApi.deleteFiles([file.key]);

  await db.delete(filesTable).where(eq(filesTable.id, fileId));

  return { success: true };
}

export async function createFolder(name: string, parentId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const [parentFolder] = await db
    .selectDistinct()
    .from(foldersTable)
    .where(eq(foldersTable.id, parentId));

  if (!parentFolder) {
    return { error: "Parent folder not found" };
  }

  if (parentFolder.ownerId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  const [existingFolder] = await db
    .select()
    .from(foldersTable)
    .where(eq(foldersTable.name, name));

  if (existingFolder) {
    return { error: "A folder with this name already exists." };
  }

  await db
    .insert(foldersTable)
    .values({
      name,
      parentId,
      ownerId: session.user.id,
    })
    .returning();

  return { success: true };
}

export async function deleteFolder(folderId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized" };
  }

  const [folder] = await db
    .selectDistinct()
    .from(foldersTable)
    .where(eq(foldersTable.id, folderId));

  if (!folder) {
    return { error: "Folder not found" };
  }

  if (folder.ownerId !== session.user.id) {
    return { error: "Unauthorized" };
  }

  const nestedFolders = await db
    .select()
    .from(foldersTable)
    .where(eq(foldersTable.parentId, folderId));

  const nestedFiles = await db
    .select()
    .from(filesTable)
    .where(eq(filesTable.parentId, folderId));

  if (nestedFiles.length > 0) {
    nestedFiles.forEach(async (file) => {
      await deleteFile(file.id);
    });
  }

  if (nestedFolders.length > 0) {
    nestedFolders.forEach(async (nestedFolder) => {
      await deleteFolder(nestedFolder.id);
    });
  }

  await db.delete(foldersTable).where(eq(foldersTable.id, folderId));

  return { success: true };
}
