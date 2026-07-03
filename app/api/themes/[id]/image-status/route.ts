import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { imageActive, image2Active } = body;

    const theme = await prisma.theme.findUnique({
      where: { id: Number(id) },
    });

    if (!theme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    const updateData: { imageActive?: boolean; image2Active?: boolean } = {};

    if (imageActive !== undefined) {
      if (imageActive && !theme.image) {
        return NextResponse.json(
          { error: "Cannot activate preview 1 without an image" },
          { status: 400 }
        );
      }
      updateData.imageActive = Boolean(imageActive);
    }

    if (image2Active !== undefined) {
      if (image2Active && !theme.image2) {
        return NextResponse.json(
          { error: "Cannot activate preview 2 without an image" },
          { status: 400 }
        );
      }
      updateData.image2Active = Boolean(image2Active);
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "imageActive or image2Active is required" },
        { status: 400 }
      );
    }

    const updated = await prisma.theme.update({
      where: { id: Number(id) },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PATCH IMAGE STATUS ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
