import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createOrganizationWithOwner } from "~/db/queries";
import { auth } from "~/lib/auth";
import { createOrganizationSchema } from "~/lib/validation";

export async function POST(request: Request) {
  const result = createOrganizationSchema.safeParse(await request.json());
  if (!result.success) {
    return NextResponse.json({ message: result.error }, { status: 400 });
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return NextResponse.json(
      { message: "user not authenticated" },
      { status: 401 },
    );
  }

  try {
    const organization = await createOrganizationWithOwner(
      session.user.id,
      result.data.name,
      result.data.slug,
    );
    return NextResponse.json(
      {
        message: `Organization with ID ${organization.id} was successfully created`,
      },
      { status: 201 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Failed to create an organization" },
      { status: 500 },
    );
  }
}
