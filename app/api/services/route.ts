import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// GET ALL SERVICES
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isPublic = searchParams.get("public") === "true";

    if (isPublic) {
      // Public API: only active services
      const settings = await prisma.serviceSettings.findFirst();
      const maxDisplay = settings?.maxDisplay || 3;

      const services = await prisma.service.findMany({
        where: {
          isActive: true,
        },
        orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
        take: maxDisplay,
      });

      const transformedServices = services.map((service) => ({
        ...service,
        features: service.features as string[],
      }));

      return NextResponse.json(transformedServices);
    }

    // Admin API: all services
    const services = await prisma.service.findMany({
      orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
    });

    const transformedServices = services.map((service) => ({
      ...service,
      features: service.features as string[],
    }));

    return NextResponse.json(transformedServices);
  } catch (err) {
    console.error("GET SERVICES ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// CREATE SERVICE
export async function POST(req: Request) {
  try {
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

    // Validation
    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    // Parse features
    let features: string[] = [];
    try {
      features = JSON.parse(featuresStr);
    } catch {
      features = [];
    }

    // Handle image upload
    let imagePath: string | null = null;
    if (imageFile && imageFile.size > 0) {
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create unique filename
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

      // Ensure directory exists
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (err) {
        console.error("Error creating directory:", err);
      }

      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      imagePath = `/images/services/${filename}`;
    }

    const service = await prisma.service.create({
      data: {
        title,
        description,
        icon: icon || "Star",
        image: imagePath,
        color: color || "from-gray-400 to-gray-500",
        features,
        buttonText: buttonText || "Lihat Tema Ini",
        buttonLink: buttonLink || null,
        isActive,
        isFeatured,
        priority,
      },
    });

    return NextResponse.json(service);
  } catch (err) {
    console.error("CREATE SERVICE ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
