import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";

// GET SINGLE SERVICE
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const service = await prisma.service.findUnique({
      where: { id: Number(id) },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...service,
      features: service.features as string[],
    });
  } catch (err) {
    console.error("GET SERVICE ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// UPDATE SERVICE
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const icon = formData.get("icon") as string;
    const color = formData.get("color") as string;
    const featuresStr = formData.get("features") as string;
    const buttonText = formData.get("buttonText") as string;
    const buttonLink = formData.get("buttonLink") as string;
    const isActive = formData.get("isActive") === "true";
    const isFeatured = formData.get("isFeatured") === "true";
    const priority = parseInt(formData.get("priority") as string) || 0;
    const imageFile = formData.get("image") as File | null;
    const keepExistingImage = formData.get("keepExistingImage") === "true";

    // Parse features
    let features: string[] = [];
    try {
      features = JSON.parse(featuresStr);
    } catch {
      features = [];
    }

    // Get existing service
    const existingService = await prisma.service.findUnique({
      where: { id: Number(id) },
    });

    if (!existingService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // Handle image upload
    let imagePath: string | null = existingService.image;

    if (imageFile && imageFile.size > 0) {
      // Delete old image if exists
      if (existingService.image) {
        const oldImagePath = path.join(
          process.cwd(),
          "public",
          existingService.image
        );
        try {
          await unlink(oldImagePath);
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }

      // Upload new image
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const timestamp = Date.now();
      const filename = `service-${timestamp}-${imageFile.name.replace(
        /\s/g,
        "-"
      )}`;
      const uploadDir = path.join(
        process.cwd(),
        "public",
        "images",
        "services"
      );

      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) {
        console.error("Error creating directory:", err);
      }

      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      imagePath = `/images/services/${filename}`;
    } else if (!keepExistingImage) {
      // Delete image if requested
      if (existingService.image) {
        const oldImagePath = path.join(
          process.cwd(),
          "public",
          existingService.image
        );
        try {
          await unlink(oldImagePath);
        } catch (err) {
          console.error("Error deleting image:", err);
        }
      }
      imagePath = null;
    }

    const updated = await prisma.service.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        icon,
        image: imagePath,
        color,
        features,
        buttonText,
        buttonLink: buttonLink || null,
        isActive,
        isFeatured,
        priority,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("UPDATE SERVICE ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE SERVICE
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Get service to delete image
    const service = await prisma.service.findUnique({
      where: { id: Number(id) },
    });

    if (service?.image) {
      const imagePath = path.join(process.cwd(), "public", service.image);
      try {
        await unlink(imagePath);
      } catch (err) {
        console.error("Error deleting image:", err);
      }
    }

    await prisma.service.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE SERVICE ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
