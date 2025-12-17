import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/upload";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const theme = await prisma.theme.findUnique({
      where: { id: Number(id) },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!theme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    // Transform data
    const transformedTheme = {
      ...theme,
      categories: theme.categories.map((tc) => tc.category),
      tags: theme.tags.map((tt) => tt.tag),
    };

    return NextResponse.json(transformedTheme);
  } catch (err) {
    console.error("GET THEME ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const form = await req.formData();

    const name = form.get("name") as string;
    const price = Number(form.get("price"));
    const demoUrl = form.get("demoUrl") as string;

    // Get multiple category IDs
    const categoryIdsRaw = form.get("categoryIds") as string;
    let categoryIds: number[] = [];

    try {
      categoryIds = JSON.parse(categoryIdsRaw);
    } catch {
      categoryIds = categoryIdsRaw
        .split(",")
        .map((id) => Number(id.trim()))
        .filter((id) => !isNaN(id));
    }

    // Get multiple tag IDs
    const tagIdsRaw = form.get("tagIds") as string;
    let tagIds: number[] = [];

    if (tagIdsRaw) {
      try {
        tagIds = JSON.parse(tagIdsRaw);
      } catch {
        tagIds = tagIdsRaw
          .split(",")
          .map((id) => Number(id.trim()))
          .filter((id) => !isNaN(id));
      }
    }

    let imageField = {};

    // Upload new image if provided
    const image = form.get("image");
    if (image instanceof File) {
      const url = await uploadImage(image);
      imageField = { image: url };
    }

    // Update theme
    const updated = await prisma.theme.update({
      where: { id: Number(id) },
      data: {
        name,
        price,
        demoUrl,
        ...imageField,
        // Replace all categories
        categories: {
          deleteMany: {},
          create: categoryIds.map((categoryId) => ({
            categoryId,
          })),
        },
        // Replace all tags
        tags: {
          deleteMany: {},
          create: tagIds.map((tagId) => ({
            tagId,
          })),
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("UPDATE THEME ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Cascade delete will automatically remove ThemeCategory and ThemeTag records
    await prisma.theme.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE THEME ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
