import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET SINGLE PRICING PLAN
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const plan = await prisma.pricingPlan.findUnique({
      where: { id: Number(id) },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Pricing plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...plan,
      features: plan.features as string[],
    });
  } catch (err) {
    console.error("GET PRICING PLAN ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// UPDATE PRICING PLAN
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const {
      name,
      subtitle,
      price,
      period,
      features,
      isActive,
      isHighlight,
      isPopular,
      priority,
      icon,
      gradient,
      buttonStyle,
      discountPrice,
      discountEndDate,
      whatsappMessage,
    } = body;

    const updated = await prisma.pricingPlan.update({
      where: { id: Number(id) },
      data: {
        name,
        subtitle,
        price: Number(price),
        period,
        features,
        isActive,
        isHighlight,
        isPopular,
        priority: Number(priority),
        icon,
        gradient,
        buttonStyle,
        discountPrice: discountPrice ? Number(discountPrice) : null,
        discountEndDate: discountEndDate ? new Date(discountEndDate) : null,
        whatsappMessage: whatsappMessage || null,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("UPDATE PRICING PLAN ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE PRICING PLAN
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.pricingPlan.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE PRICING PLAN ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
