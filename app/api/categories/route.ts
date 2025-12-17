import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET ALL CATEGORY
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { id: "desc" },
    });

    return NextResponse.json(categories);
  } catch (err) {
    console.error("GET CATEGORY ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// CREATE CATEGORY
export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    const exists = await prisma.category.findUnique({
      where: { name },
    });

    if (exists) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: { name },
    });

    return NextResponse.json(category);
  } catch (err) {
    console.error("POST CATEGORY ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
