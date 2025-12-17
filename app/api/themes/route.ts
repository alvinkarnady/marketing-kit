import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/upload";

export async function GET() {
  try {
    const themes = await prisma.theme.findMany({
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
      orderBy: { id: "desc" },
    });

    // Transform data to flatten categories and tags
    const transformedThemes = themes.map((theme) => ({
      ...theme,
      categories: theme.categories.map((tc) => tc.category),
      tags: theme.tags.map((tt) => tt.tag),
    }));

    return NextResponse.json({ data: transformedThemes });
  } catch (err) {
    console.error("GET THEMES ERROR", err);
    return NextResponse.json(
      { error: "Failed to load themes" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
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

    if (categoryIds.length === 0) {
      return NextResponse.json(
        { error: "At least one category is required" },
        { status: 400 }
      );
    }

    let imageUrl = null;
    const image = form.get("image");
    if (image instanceof File) {
      imageUrl = await uploadImage(image);
    }

    // Create theme with categories and tags
    const theme = await prisma.theme.create({
      data: {
        name,
        price,
        demoUrl,
        image: imageUrl,
        categories: {
          create: categoryIds.map((categoryId) => ({
            categoryId,
          })),
        },
        tags: {
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

    return NextResponse.json(theme);
  } catch (err) {
    console.error("CREATE THEME ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
