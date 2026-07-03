import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

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
      categories: theme.categories.map((tc) => ({
        ...tc.category,
        priority: tc.priority,
      })),
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
    const imageFile = form.get("image") as File | null;
    const image2File = form.get("image2") as File | null;
    const keepExistingImage = form.get("keepExistingImage") === "true";
    const keepExistingImage2 = form.get("keepExistingImage2") === "true";
    const imageActiveRaw = form.get("imageActive");
    const image2ActiveRaw = form.get("image2Active");

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

    // Get existing theme
    const existingTheme = await prisma.theme.findUnique({
      where: { id: Number(id) },
    });

    if (!existingTheme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    // Handle image upload
    let imagePath: string | null = existingTheme.image;

    if (imageFile && imageFile.size > 0) {
      // Delete old image from Cloudinary if exists
      if (existingTheme.image) {
        await deleteFromCloudinary(existingTheme.image);
      }

      // Upload new image to Cloudinary
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      imagePath = await uploadToCloudinary(buffer, "marketing-kit/themes");
    } else if (!keepExistingImage) {
      // Delete image if requested
      if (existingTheme.image) {
        await deleteFromCloudinary(existingTheme.image);
      }
      imagePath = null;
    }

    // Handle image2 upload
    let image2Path: string | null = existingTheme.image2;

    if (image2File && image2File.size > 0) {
      if (existingTheme.image2) {
        await deleteFromCloudinary(existingTheme.image2);
      }

      const bytes = await image2File.arrayBuffer();
      const buffer = Buffer.from(bytes);

      image2Path = await uploadToCloudinary(buffer, "marketing-kit/themes");
    } else if (!keepExistingImage2) {
      if (existingTheme.image2) {
        await deleteFromCloudinary(existingTheme.image2);
      }
      image2Path = null;
    }

    let imageActive =
      imageActiveRaw !== null
        ? imageActiveRaw === "true"
        : existingTheme.imageActive;
    let image2Active =
      image2ActiveRaw !== null
        ? image2ActiveRaw === "true"
        : existingTheme.image2Active;

    if (!imagePath) imageActive = false;
    if (!image2Path) image2Active = false;

    // Preserve per-category priority when updating category links
    const existingLinks = await prisma.themeCategory.findMany({
      where: { themeId: Number(id) },
    });
    const priorityByCategory = new Map(
      existingLinks.map((l) => [l.categoryId, l.priority])
    );

    const categoryCreates = await Promise.all(
      categoryIds.map(async (categoryId) => {
        if (priorityByCategory.has(categoryId)) {
          return {
            categoryId,
            priority: priorityByCategory.get(categoryId)!,
          };
        }
        const max = await prisma.themeCategory.aggregate({
          where: { categoryId },
          _max: { priority: true },
        });
        return {
          categoryId,
          priority: (max._max.priority ?? -1) + 1,
        };
      })
    );

    // Update theme
    const updated = await prisma.theme.update({
      where: { id: Number(id) },
      data: {
        name,
        price,
        demoUrl,
        image: imagePath,
        image2: image2Path,
        imageActive,
        image2Active,
        // Replace all categories
        categories: {
          deleteMany: {},
          create: categoryCreates,
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

    // Get theme first
    const theme = await prisma.theme.findUnique({
      where: { id: Number(id) },
    });

    if (!theme) {
      return NextResponse.json({ error: "Theme not found" }, { status: 404 });
    }

    // Delete images from Cloudinary if exist
    if (theme.image) {
      await deleteFromCloudinary(theme.image);
    }
    if (theme.image2) {
      await deleteFromCloudinary(theme.image2);
    }

    // Delete theme from database (cascade will handle relations)
    await prisma.theme.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE THEME ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
