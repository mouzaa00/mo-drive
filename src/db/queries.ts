import { CreateOrg } from "~/lib/validation";
import { db } from ".";
import { orgMembersTable, orgsTable } from "./schema";

export async function createOrg(data: CreateOrg & { userId: string }) {
  const result = await db
    .insert(orgsTable)
    .values({
      id: crypto.randomUUID(),
      name: data.name,
      slug: data.slug,
    })
    .returning({ orgId: orgsTable.id });

  await db.insert(orgMembersTable).values({
    id: crypto.randomUUID(),
    userId: data.userId,
    orgId: result[0].orgId,
  });
}
