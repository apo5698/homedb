import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  _: NextRequest,
  { params }: { params: { id: string } },
) => {
  const client = new PrismaClient();
  const petId = parseInt(params.id);

  return client.weight
    .findMany({
      where: { petId },
      orderBy: { time: "desc" },
    })
    .then((baths) => NextResponse.json(baths))
    .catch((error: any) => {
      console.error(error.code);

      if (error.code === "P2003") {
        return NextResponse.json(
          { error: `Pet(id=${petId}) not found` },
          { status: 404 },
        );
      } else {
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 },
        );
      }
    });
};

export const POST = async (
  request: NextRequest,
  { params }: { params: { id: string } },
) => {
  const client = new PrismaClient();
  const petId = parseInt(params.id);
  const { weight, time } = await request.json();

  return client.weight
    .create({
      data: {
        petId,
        weight,
        time,
      },
    })
    .then(() => NextResponse.json(null, { status: 201 }))
    .catch((error: any) => {
      console.error(error);

      if (error.code === "P2003") {
        return NextResponse.json(
          { error: `Pet(id=${petId}) not found` },
          { status: 404 },
        );
      } else {
        return NextResponse.json(
          { error: "Internal server error" },
          { status: 500 },
        );
      }
    });
};
