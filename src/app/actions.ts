"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
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
    throw new Error("Unauthorized");
  }

  const [file] = await db
    .selectDistinct()
    .from(filesTable)
    .where(eq(filesTable.id, fileId));

  if (!file) {
    throw new Error("File not found");
  }

  if (file.ownerId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  await utApi.deleteFiles([file.key]);

  await db.delete(filesTable).where(eq(filesTable.id, fileId));

  return { success: true, fileName: file.name };
}

export async function createFolder(
  prevState: { error: string; success: boolean; fields: { name: string } },
  formData: FormData,
) {
  const name = formData.get("name") as string;
  const parentId = formData.get("parentId") as string;

  if (!name || !parentId) {
    return {
      error: "Name and parentId are required",
      success: false,
      fields: { name },
    };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return { error: "Unauthorized", success: false, fields: { name } };
  }

  const [parentFolder] = await db
    .selectDistinct()
    .from(foldersTable)
    .where(eq(foldersTable.id, parentId));

  if (!parentFolder) {
    return {
      error: "Parent folder not found",
      success: false,
      fields: { name },
    };
  }

  if (parentFolder.ownerId !== session.user.id) {
    return { error: "Unauthorized", success: false, fields: { name } };
  }

  const trimmedName = name.trim();

  const [existingFolder] = await db
    .select()
    .from(foldersTable)
    .where(
      and(
        eq(foldersTable.name, trimmedName),
        eq(foldersTable.parentId, parentId),
      ),
    );

  if (existingFolder) {
    return {
      error: "A folder with this name already exists.",
      success: false,
      fields: { name },
    };
  }

  await db
    .insert(foldersTable)
    .values({
      name,
      parentId,
      ownerId: session.user.id,
    })
    .returning();

  revalidatePath(`/f/${parentId}`);
  return { error: "", success: true, fields: { name: "" } };
}

export async function deleteFolder(folderId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const [folder] = await db
    .selectDistinct()
    .from(foldersTable)
    .where(eq(foldersTable.id, folderId));

  if (!folder) {
    throw new Error("Folder not found");
  }

  if (folder.ownerId !== session.user.id) {
    throw new Error("Unauthorized");
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

  return { success: true, folderName: folder.name };
}
