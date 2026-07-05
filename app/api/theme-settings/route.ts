import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { jsonWithPublicCache } from "@/lib/public-cache";

export async function GET() {
  try {
    let settings = await prisma.themeSettings.findFirst();
    if (!settings) {
      settings = await prisma.themeSettings.create({
        data: { showPrice: true, heroPreviewImage: 1 },
      });
    }
    return jsonWithPublicCache(settings);
  } catch (err) {
    console.error("GET THEME SETTINGS ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { showPrice, heroPreviewImage } = body;

    if (
      heroPreviewImage !== undefined &&
      heroPreviewImage !== 1 &&
      heroPreviewImage !== 2
    ) {
      return NextResponse.json(
        { error: "heroPreviewImage must be 1 or 2" },
        { status: 400 }
      );
    }

    const updateData: { showPrice?: boolean; heroPreviewImage?: number } = {};
    if (showPrice !== undefined) updateData.showPrice = showPrice;
    if (heroPreviewImage !== undefined)
      updateData.heroPreviewImage = heroPreviewImage;

    let settings = await prisma.themeSettings.findFirst();
    if (settings) {
      settings = await prisma.themeSettings.update({
        where: { id: settings.id },
        data: updateData,
      });
    } else {
      settings = await prisma.themeSettings.create({
        data: {
          showPrice: showPrice !== undefined ? showPrice : true,
          heroPreviewImage:
            heroPreviewImage !== undefined ? heroPreviewImage : 1,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (err) {
    console.error("POST THEME SETTINGS ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
