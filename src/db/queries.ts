import { db } from ".";
import { membershipsTable, organizationsTable } from "./schema";

// if step 2 fails for any reason
// Drizzle automatically rolls back step 1. No orphened data!
export async function createOrganizationWithOwner(
  userId: string,
  orgName: string,
  orgSlug: string,
) {
  // We use db.transaction to ensure ATOMICITY (all-or-nothing)
  return await db.transaction(async (tx) => {
    // 1. create organization
    // we use .returning() to get the newly created org's ID immediately
    const [newOrganization] = await tx
      .insert(organizationsTable)
      .values({
        name: orgName,
        slug: orgSlug,
      })
      .returning({ id: organizationsTable.id });

    // 2. create membership linking the User to the new Org
    await tx.insert(membershipsTable).values({
      userId: userId,
      organizationId: newOrganization.id,
      role: "owner", // Explicitly setting the role we defined in our enum
    });

    return newOrganization;
  });
}
