import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET SINGLE TAG
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const tag = await prisma.tag.findUnique({
      where: { id: Number(id) },
    });

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json(tag);
  } catch (err) {
    console.error("GET TAG ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// UPDATE TAG
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { name, color, icon } = await req.json();

    const updated = await prisma.tag.update({
      where: { id: Number(id) },
      data: { name, color, icon },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("UPDATE TAG ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE TAG
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Cascade delete will automatically remove ThemeTag records
    await prisma.tag.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE TAG ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
