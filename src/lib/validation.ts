import z from "zod";

export const createOrgSchema = z.object({
  name: z
    .string()
    .min(2, "Org name must be at least 2 characters")
    .max(50, "Org name must be at most 50 characters"),
  slug: z
    .string()
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    )
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug must be at most 50 characters"),
});

export type CreateOrg = z.infer<typeof createOrgSchema>;
