// src/app/api/preorders/[preorderId]/route.ts

import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    preorderId: string;
  }>;
};

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { preorderId } = await params;

    const preorder = await prisma.preorder.findUnique({
      where: { id: preorderId },
    });

    if (!preorder) {
      return NextResponse.json(
        { error: "Preorder not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(preorder);
  } catch (error) {
    console.error("Error fetching preorder:", error);
    return NextResponse.json(
      { error: "Failed to fetch preorder" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { preorderId } = await params;
    const body = await request.json();

    const preorder = await prisma.preorder.update({
      where: { id: preorderId },
      data: {
        name: body.name,
        productCount: Number(body.productCount),
        preorderWhen: new Date(body.preorderWhen),
        startAt: new Date(body.startAt),
        endAt: new Date(body.endAt),
        status: body.status,
      },
    });

    return NextResponse.json(preorder);
  } catch (error) {
    console.error("Error updating preorder:", error);
    return NextResponse.json(
      { error: "Failed to update preorder" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const { preorderId } = await params;

    await prisma.preorder.delete({
      where: { id: preorderId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting preorder:", error);
    return NextResponse.json(
      { error: "Failed to delete preorder" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { preorderId } = await params;
    const body = await request.json();

    const preorder = await prisma.preorder.update({
      where: { id: preorderId },
      data: {
        status: body.status,
      },
    });

    return NextResponse.json(preorder);
  } catch (error) {
    console.error("Error updating preorder status:", error);
    return NextResponse.json(
      { error: "Failed to update preorder status" },
      { status: 500 },
    );
  }
}
