// app/api/auth/login/route.ts
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signJwt } from "@/lib/jwt";
import { serialize } from "cookie";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password)
      return new Response(JSON.stringify({ error: "Missing" }), {
        status: 400,
      });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
      });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok)
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
      });

    const token = await signJwt(
      { sub: String(user.id), email: user.email, role: user.role },
      "7d"
    );

    const cookie = serialize("mk_session", token, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Set-Cookie": cookie, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
