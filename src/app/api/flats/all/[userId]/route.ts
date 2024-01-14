import { NextRequest } from "next/server";
import { prisma } from "../../../../../../prisma/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const userId = params.userId;
  const flats = await prisma.flat.findMany({
    where: {
      ownerId: {
        not: userId,
      },
    },
    include: {
      address: true,
    },
  });

  return Response.json(flats);
}
