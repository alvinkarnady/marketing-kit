import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { categoryId, orderedThemeIds } = await req.json();

    if (!categoryId || !Array.isArray(orderedThemeIds)) {
      return NextResponse.json(
        { error: "categoryId and orderedThemeIds are required" },
        { status: 400 }
      );
    }

    if (orderedThemeIds.length === 0) {
      return NextResponse.json(
        { error: "orderedThemeIds cannot be empty" },
        { status: 400 }
      );
    }

    const category = await prisma.category.findUnique({
      where: { id: Number(categoryId) },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    await prisma.$transaction(
      orderedThemeIds.map((themeId: number, index: number) =>
        prisma.themeCategory.updateMany({
          where: {
            themeId: Number(themeId),
            categoryId: Number(categoryId),
          },
          data: { priority: index },
        })
      )
    );

    return NextResponse.json({
      message: "Order updated",
      categoryId: Number(categoryId),
      count: orderedThemeIds.length,
    });
  } catch (err) {
    console.error("REORDER THEMES ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
