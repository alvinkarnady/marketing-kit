import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/upload";

// GET SINGLE TESTIMONIAL
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const testimonial = await prisma.testimonial.findUnique({
      where: { id: Number(id) },
      include: {
        theme: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(testimonial);
  } catch (err) {
    console.error("GET TESTIMONIAL ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// UPDATE TESTIMONIAL
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const form = await req.formData();

    const name = form.get("name") as string;
    const role = form.get("role") as string;
    const email = form.get("email") as string | null;
    const rating = Number(form.get("rating"));
    const text = form.get("text") as string;
    const event = form.get("event") as string;
    const weddingDate = form.get("weddingDate") as string | null;
    const themeId = form.get("themeId") as string | null;

    const isActive = form.get("isActive") === "true";
    const isApproved = form.get("isApproved") === "true";
    const isFeatured = form.get("isFeatured") === "true";
    const priority = Number(form.get("priority"));

    // Check if approval status changed
    const current = await prisma.testimonial.findUnique({
      where: { id: Number(id) },
    });

    const approvedAtField =
      !current?.isApproved && isApproved ? { approvedAt: new Date() } : {};

    let imageField = {};
    const image = form.get("image");
    if (image instanceof File) {
      const url = await uploadImage(image);
      imageField = { image: url };
    }

    const updated = await prisma.testimonial.update({
      where: { id: Number(id) },
      data: {
        name,
        role,
        email,
        rating,
        text,
        event,
        weddingDate: weddingDate ? new Date(weddingDate) : null,
        themeId: themeId ? Number(themeId) : null,
        isActive,
        isApproved,
        isFeatured,
        priority,
        ...imageField,
        ...approvedAtField,
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

    return NextResponse.json(updated);
  } catch (err) {
    console.error("UPDATE TESTIMONIAL ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE TESTIMONIAL
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.testimonial.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE TESTIMONIAL ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
