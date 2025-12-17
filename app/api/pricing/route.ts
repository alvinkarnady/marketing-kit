import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET ALL PRICING PLANS
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isPublic = searchParams.get("public") === "true";

    if (isPublic) {
      // Public API: only active plans
      const settings = await prisma.pricingSettings.findFirst();
      const maxDisplay = settings?.maxDisplay || 3;

      // Check for active discounts
      const now = new Date();

      const plans = await prisma.pricingPlan.findMany({
        where: {
          isActive: true,
        },
        orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
        take: maxDisplay,
      });

      // Transform and apply active discounts
      const transformedPlans = plans.map((plan) => {
        const hasActiveDiscount =
          plan.discountPrice &&
          plan.discountEndDate &&
          plan.discountEndDate > now;

        return {
          ...plan,
          features: plan.features as string[],
          currentPrice: hasActiveDiscount ? plan.discountPrice : plan.price,
          hasDiscount: hasActiveDiscount,
          originalPrice: hasActiveDiscount ? plan.price : null,
        };
      });

      return NextResponse.json(transformedPlans);
    }

    // Admin API: all plans
    const plans = await prisma.pricingPlan.findMany({
      orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
    });

    const transformedPlans = plans.map((plan) => ({
      ...plan,
      features: plan.features as string[],
    }));

    return NextResponse.json(transformedPlans);
  } catch (err) {
    console.error("GET PRICING ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// CREATE PRICING PLAN
export async function POST(req: Request) {
  try {
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

    // Validation
    if (!name || !subtitle || !price || !features) {
      return NextResponse.json(
        { error: "Name, subtitle, price, and features are required" },
        { status: 400 }
      );
    }

    const plan = await prisma.pricingPlan.create({
      data: {
        name,
        subtitle,
        price: Number(price),
        period: period || "/undangan",
        features,
        isActive: isActive !== undefined ? isActive : true,
        isHighlight: isHighlight || false,
        isPopular: isPopular || false,
        priority: Number(priority) || 0,
        icon: icon || "Star",
        gradient: gradient || "from-gray-100 to-gray-200",
        buttonStyle:
          buttonStyle ||
          "bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-600 hover:to-gray-700",
        discountPrice: discountPrice ? Number(discountPrice) : null,
        discountEndDate: discountEndDate ? new Date(discountEndDate) : null,
        whatsappMessage: whatsappMessage || null,
      },
    });

    return NextResponse.json(plan);
  } catch (err) {
    console.error("CREATE PRICING ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
