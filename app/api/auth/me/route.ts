// app/api/auth/me/route.ts
import { verifyJwt } from "@/lib/jwt";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie
      .split(";")
      .map((s) => s.trim())
      .find((s) => s.startsWith("mk_session="));
    if (!match)
      return new Response(JSON.stringify({ user: null }), { status: 200 });

    const token = match.split("=")[1];
    const payload = await verifyJwt(token);
    if (!payload?.sub)
      return new Response(JSON.stringify({ user: null }), { status: 200 });

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.sub) },
    });
    if (!user)
      return new Response(JSON.stringify({ user: null }), { status: 200 });

    const { password, ...rest } = user;
    return new Response(JSON.stringify({ user: rest }), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ user: null }), { status: 500 });
  }
}
