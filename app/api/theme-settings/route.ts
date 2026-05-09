import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.themeSettings.findFirst();
    if (!settings) {
      settings = await prisma.themeSettings.create({
        data: { showPrice: true },
      });
    }
    return NextResponse.json(settings);
  } catch (err) {
    console.error("GET THEME SETTINGS ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { showPrice } = await req.json();

    let settings = await prisma.themeSettings.findFirst();
    if (settings) {
      settings = await prisma.themeSettings.update({
        where: { id: settings.id },
        data: { showPrice },
      });
    } else {
      settings = await prisma.themeSettings.create({
        data: { showPrice },
      });
    }

    return NextResponse.json(settings);
  } catch (err) {
    console.error("POST THEME SETTINGS ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
