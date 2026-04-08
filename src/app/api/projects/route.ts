import { headers } from "next/headers";
import { db } from "~/db";
import { projectsTable } from "~/db/schema";
import { auth } from "~/lib/auth";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const body = await request.json();

  if (!body.name || typeof body.name !== "string") {
    return new Response(JSON.stringify({ error: "Project name is required" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    const [project] = await db
      .insert(projectsTable)
      .values({
        name: body.name,
        ownerId: session.user.id,
      })
      .returning();
    return new Response(JSON.stringify(project), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return new Response(JSON.stringify({ error: "Failed to create project" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
