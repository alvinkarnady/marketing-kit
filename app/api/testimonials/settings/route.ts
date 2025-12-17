import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET SETTINGS
export async function GET() {
  try {
    let settings = await prisma.testimonialSettings.findFirst();

    // Create default settings if not exists
    if (!settings) {
      settings = await prisma.testimonialSettings.create({
        data: {
          maxDisplay: 6,
          autoApprove: false,
          requireApproval: true,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (err) {
    console.error("GET SETTINGS ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// UPDATE SETTINGS
export async function PUT(req: Request) {
  try {
    const { maxDisplay, autoApprove, requireApproval } = await req.json();

    let settings = await prisma.testimonialSettings.findFirst();

    if (!settings) {
      settings = await prisma.testimonialSettings.create({
        data: {
          maxDisplay,
          autoApprove,
          requireApproval,
        },
      });
    } else {
      settings = await prisma.testimonialSettings.update({
        where: { id: settings.id },
        data: {
          maxDisplay,
          autoApprove,
          requireApproval,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (err) {
    console.error("UPDATE SETTINGS ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
