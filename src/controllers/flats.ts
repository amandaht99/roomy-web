import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../../prisma/db";

export function getAllFlats(userId: string) {
  return prisma.flat.findMany({
    where: {
      ownerId: {
        not: userId,
      },
    },
    include: {
      address: true,
    },
  });
}

export function putFlatDate(
  flatId: string,
  body: { type: string; date: string }
) {
  try {
    const flat = prisma.flat.update({
      where: {
        id: parseInt(flatId),
      },
      data:
        body?.type === "From"
          ? { dateFrom: new Date(body.date) }
          : { dateTo: new Date(body.date) },
      include: {
        address: true,
      },
    });
    return flat;
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === "P2025") {
      // Return null if the flat does not exist
      return null;
    }
  }
}
