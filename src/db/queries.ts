import { firstOrUndefined } from "~/lib/utils";
import { db } from ".";
import { companiesTable, type CreateCompany } from "./schema";

export async function createCompany(data: CreateCompany) {
  const result = await db.insert(companiesTable).values(data).returning();
  return firstOrUndefined(result);
}
