import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET ALL TAGS
export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { id: "desc" },
    });

    return NextResponse.json(tags);
  } catch (err) {
    console.error("GET TAGS ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// CREATE TAG
export async function POST(req: Request) {
  try {
    const { name, color, icon } = await req.json();

    // Validation
    if (!name || !color || !icon) {
      return NextResponse.json(
        { error: "Name, color, and icon are required" },
        { status: 400 }
      );
    }

    // Check if tag already exists
    const exists = await prisma.tag.findUnique({
      where: { name },
    });

    if (exists) {
      return NextResponse.json(
        { error: "Tag already exists" },
        { status: 400 }
      );
    }

    const tag = await prisma.tag.create({
      data: { name, color, icon },
    });

    return NextResponse.json(tag);
  } catch (err) {
    console.error("POST TAG ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
