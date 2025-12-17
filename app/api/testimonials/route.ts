import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/upload";

// GET ALL TESTIMONIALS (for admin)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isPublic = searchParams.get("public") === "true";

    if (isPublic) {
      // Public API: only active & approved testimonials
      const settings = await prisma.testimonialSettings.findFirst();
      const maxDisplay = settings?.maxDisplay || 6;

      const testimonials = await prisma.testimonial.findMany({
        where: {
          isActive: true,
          isApproved: true,
        },
        include: {
          theme: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: [
          { isFeatured: "desc" },
          { priority: "desc" },
          { createdAt: "desc" },
        ],
        take: maxDisplay,
      });

      return NextResponse.json(testimonials);
    }

    // Admin API: all testimonials
    const testimonials = await prisma.testimonial.findMany({
      include: {
        theme: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(testimonials);
  } catch (err) {
    console.error("GET TESTIMONIALS ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// CREATE TESTIMONIAL
export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const name = form.get("name") as string;
    const role = (form.get("role") as string) || "Pasangan Pengantin";
    const email = form.get("email") as string | null;
    const rating = Number(form.get("rating")) || 5;
    const text = form.get("text") as string;
    const event = form.get("event") as string;
    const weddingDate = form.get("weddingDate") as string | null;
    const themeId = form.get("themeId") as string | null;

    // Admin controls
    const isActive = form.get("isActive") === "true";
    const isApproved = form.get("isApproved") === "true";
    const isFeatured = form.get("isFeatured") === "true";
    const priority = Number(form.get("priority")) || 0;
    const isAdminCreate = form.get("isAdminCreate") === "true";

    // Validation
    if (!name || !text || !event) {
      return NextResponse.json(
        { error: "Name, text, and event are required" },
        { status: 400 }
      );
    }

    // Handle image upload
    let imageUrl = null;
    const image = form.get("image");
    if (image instanceof File) {
      imageUrl = await uploadImage(image);
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        role,
        image: imageUrl,
        email,
        rating,
        text,
        event,
        weddingDate: weddingDate ? new Date(weddingDate) : null,
        themeId: themeId ? Number(themeId) : null,
        isActive: isAdminCreate ? isActive : true,
        isApproved: isAdminCreate ? isApproved : false, // Needs approval if not admin
        isFeatured: isAdminCreate ? isFeatured : false,
        priority: isAdminCreate ? priority : 0,
        approvedAt: isAdminCreate && isApproved ? new Date() : null,
      },
      include: {
        theme: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(testimonial);
  } catch (err) {
    console.error("CREATE TESTIMONIAL ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
