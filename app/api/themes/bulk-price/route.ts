import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type BulkScope = "selected" | "category" | "all";
type BulkMode = "fixed" | "percentage" | "amount";
type BulkDirection = "increase" | "decrease";

interface BulkPriceBody {
  scope: BulkScope;
  themeIds?: number[];
  categoryId?: number;
  mode: BulkMode;
  value: number;
  direction?: BulkDirection;
}

async function resolveThemeIds(body: BulkPriceBody): Promise<number[]> {
  const { scope, themeIds = [], categoryId } = body;

  if (scope === "selected") {
    if (themeIds.length === 0) {
      throw new Error("At least one theme must be selected");
    }
    return themeIds;
  }

  if (scope === "category") {
    if (!categoryId) {
      throw new Error("Category is required");
    }
    const links = await prisma.themeCategory.findMany({
      where: { categoryId },
      select: { themeId: true },
    });
    return links.map((l) => l.themeId);
  }

  const all = await prisma.theme.findMany({ select: { id: true } });
  return all.map((t) => t.id);
}

function computeNewPrice(
  currentPrice: number,
  mode: BulkMode,
  value: number,
  direction: BulkDirection = "increase"
): number {
  let newPrice: number;

  if (mode === "fixed") {
    newPrice = value;
  } else if (mode === "percentage") {
    const factor = direction === "increase" ? 1 + value / 100 : 1 - value / 100;
    newPrice = Math.round(currentPrice * factor);
  } else {
    newPrice =
      direction === "increase" ? currentPrice + value : currentPrice - value;
  }

  return Math.max(0, newPrice);
}

export async function POST(req: Request) {
  try {
    const body: BulkPriceBody = await req.json();
    const { scope, mode, value, direction = "increase" } = body;

    if (!scope || !mode || value === undefined || value === null) {
      return NextResponse.json(
        { error: "scope, mode, and value are required" },
        { status: 400 }
      );
    }

    if (value < 0) {
      return NextResponse.json(
        { error: "value must be positive" },
        { status: 400 }
      );
    }

    if (mode !== "fixed" && !["increase", "decrease"].includes(direction)) {
      return NextResponse.json(
        { error: "direction must be increase or decrease" },
        { status: 400 }
      );
    }

    let themeIds: number[];
    try {
      themeIds = await resolveThemeIds(body);
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Invalid scope" },
        { status: 400 }
      );
    }

    if (themeIds.length === 0) {
      return NextResponse.json(
        { error: "No themes match the selected scope" },
        { status: 400 }
      );
    }

    if (mode === "fixed") {
      const result = await prisma.theme.updateMany({
        where: { id: { in: themeIds } },
        data: { price: value },
      });

      const themes = await prisma.theme.findMany({
        where: { id: { in: themeIds } },
        select: { id: true, name: true, price: true },
      });

      return NextResponse.json({ updated: result.count, themes });
    }

    const themes = await prisma.theme.findMany({
      where: { id: { in: themeIds } },
      select: { id: true, name: true, price: true },
    });

    const updates = themes.map((theme) => ({
      id: theme.id,
      name: theme.name,
      price: computeNewPrice(theme.price, mode, value, direction),
    }));

    await prisma.$transaction(
      updates.map((u) =>
        prisma.theme.update({
          where: { id: u.id },
          data: { price: u.price },
        })
      )
    );

    return NextResponse.json({ updated: updates.length, themes: updates });
  } catch (err) {
    console.error("BULK PRICE UPDATE ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
