"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { UTApi } from "uploadthing/server";
import { db } from "~/db";
import { filesTable } from "~/db/schema";
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

  await utApi.deleteFiles([
    file.url.replace("https://6fqomm6kp4.ufs.sh/f/", ""),
  ]);

  await db.delete(filesTable).where(eq(filesTable.id, fileId));

  return { success: true };
}
