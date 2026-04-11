import { z } from "zod";

export const createCompanySchema = z.object({
  name: z
    .string()
    .min(2, "Project name must be at least 2 characters")
    .max(50, "Project name must be less than 50 characters"),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(50, "Slug must be less than 50 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase and can only contain letters, numbers, and hyphens",
    ),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
