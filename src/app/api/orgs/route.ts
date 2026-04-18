import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { createOrg } from "~/db/queries";
import { auth } from "~/lib/auth";
import { createOrgSchema } from "~/lib/validation";

export async function POST(request: Request) {
  const result = createOrgSchema.safeParse(await request.json());
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
    await createOrg({ ...result.data, userId: session.user.id });
    return NextResponse.json({ message: "org created" }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "failed to create org" },
      { status: 500 },
    );
  }
}
