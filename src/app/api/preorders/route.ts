// src/app/api/preorders/route.ts
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { Prisma } from "@prisma/client";
// import { PrismaClient } from "@/app/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const filter = searchParams.get("filter") || "all";
    const sort = searchParams.get("sort") || "createdAt_desc";

    const skip = (page - 1) * limit;

    // Build where clause
    let where: Prisma.PreorderWhereInput = {};
    if (filter === "active") {
      where.status = "active";
    } else if (filter === "inactive") {
      where.status = "inactive";
    }

    // Build order by
    let orderBy: Prisma.PreorderOrderByWithRelationInput = {};
    switch (sort) {
      case "name_asc":
        orderBy.name = "asc";
        break;
      case "name_desc":
        orderBy.name = "desc";
        break;
      case "createdAt_asc":
        orderBy.createdAt = "asc";
        break;
      case "createdAt_desc":
        orderBy.createdAt = "desc";
        break;
      default:
        orderBy.createdAt = "desc";
    }

    const [preorders, total] = await Promise.all([
      prisma.preorder.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      prisma.preorder.count({ where }),
    ]);

    return NextResponse.json({
      preorders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching preorders:", error);
    return NextResponse.json(
      { error: "Failed to fetch preorders" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const preorder = await prisma.preorder.create({
      data: {
        name: body.name,
        productCount: Number(body.productCount),
        preorderWhen: new Date(body.preorderWhen),
        startAt: new Date(body.startAt),
        endAt: new Date(body.endAt),
        status: body.status || "active",
      },
    });

    return NextResponse.json(preorder, { status: 201 });
  } catch (error) {
    console.error("Error creating preorder:", error);
    return NextResponse.json(
      { error: "Failed to create preorder" },
      { status: 500 },
    );
  }
}

