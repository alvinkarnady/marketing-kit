import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET SETTINGS
export async function GET() {
  try {
    let settings = await prisma.serviceSettings.findFirst();

    // Create default settings if not exists
    if (!settings) {
      settings = await prisma.serviceSettings.create({
        data: {
          maxDisplay: 3,
          enableFlipAnimation: true,
          autoRotate: false,
          autoRotateInterval: 5000,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (err) {
    console.error("GET SERVICE SETTINGS ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// UPDATE SETTINGS
export async function PUT(req: Request) {
  try {
    const { maxDisplay, enableFlipAnimation, autoRotate, autoRotateInterval } =
      await req.json();

    let settings = await prisma.serviceSettings.findFirst();

    if (!settings) {
      settings = await prisma.serviceSettings.create({
        data: {
          maxDisplay,
          enableFlipAnimation,
          autoRotate,
          autoRotateInterval,
        },
      });
    } else {
      settings = await prisma.serviceSettings.update({
        where: { id: settings.id },
        data: {
          maxDisplay,
          enableFlipAnimation,
          autoRotate,
          autoRotateInterval,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (err) {
    console.error("UPDATE SERVICE SETTINGS ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
