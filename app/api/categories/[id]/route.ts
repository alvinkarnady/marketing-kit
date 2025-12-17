import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET SINGLE CATEGORY
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (err) {
    console.error("GET CATEGORY ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// UPDATE CATEGORY
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // <-- fix: await params
    const { name } = await req.json();

    const updated = await prisma.category.update({
      where: { id: Number(id) },
      data: { name },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("UPDATE CATEGORY ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE CATEGORY
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.category.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE CATEGORY ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
