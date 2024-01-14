import { NextRequest } from "next/server";
import { prisma } from "../../../../../../prisma/db";
import { clerkClient } from "@clerk/nextjs";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const flat = await prisma.flat.findUnique({
    where: {
      ownerId: params.userId,
    },
    include: {
      address: true,
    },
  });

  if (!flat) {
    return Response.json(null, { status: 404 });
  }

  const user = await clerkClient.users.getUser(flat.ownerId);
  return Response.json({ ...flat, owner: user });
}
