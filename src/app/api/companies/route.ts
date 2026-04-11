import { headers } from "next/headers";
import { createCompany } from "~/db/queries";
import { auth } from "~/lib/auth";
import { createCompanySchema } from "~/lib/validations/company";

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
    });
  }

  const body = await request.json();
  const parseResult = createCompanySchema.safeParse(body);

  if (!parseResult.success) {
    return new Response(
      JSON.stringify({
        message: "Invalid input",
      }),
      { status: 400 },
    );
  }

  const { name, slug } = parseResult.data;

  try {
    const company = await createCompany({
      ownerId: session.user.id,
      name,
      slug,
    });
    if (!company) {
      return new Response(JSON.stringify({ error: "Something went wrong" }), {
        status: 400,
      });
    }
    return new Response(JSON.stringify(company), { status: 201 });
  } catch {
    return new Response(JSON.stringify({ error: "Slug already exists" }), {
      status: 400,
    });
  }
}
