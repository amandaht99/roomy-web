import { NextRequest } from "next/server";
import { prisma } from "../../../../../../prisma/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { flatId: string } }
) {
  const body = await request.json();
  const flat = await prisma.flat.update({
    where: {
      id: parseInt(params.flatId),
    },
    data:
      body?.type === "From"
        ? { dateFrom: new Date(body.date) }
        : { dateTo: new Date(body.date) },
    include: {
      address: true,
    },
  });
  return Response.json(flat);
}
