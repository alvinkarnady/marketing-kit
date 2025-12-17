import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET SETTINGS
export async function GET() {
  try {
    let settings = await prisma.pricingSettings.findFirst();

    // Create default settings if not exists
    if (!settings) {
      settings = await prisma.pricingSettings.create({
        data: {
          maxDisplay: 3,
          whatsappNumber: "6281248406898",
        },
      });
    }

    return NextResponse.json(settings);
  } catch (err) {
    console.error("GET PRICING SETTINGS ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// UPDATE SETTINGS
export async function PUT(req: Request) {
  try {
    const { maxDisplay, whatsappNumber } = await req.json();

    let settings = await prisma.pricingSettings.findFirst();

    if (!settings) {
      settings = await prisma.pricingSettings.create({
        data: {
          maxDisplay,
          whatsappNumber,
        },
      });
    } else {
      settings = await prisma.pricingSettings.update({
        where: { id: settings.id },
        data: {
          maxDisplay,
          whatsappNumber,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (err) {
    console.error("UPDATE PRICING SETTINGS ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
