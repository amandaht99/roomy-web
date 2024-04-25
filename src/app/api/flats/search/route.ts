import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../prisma/db";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const filters = body?.filters;
  if (filters) {
    const { city, dateFrom, dateTo, hometown } = filters;

    const dateFromLte = new Date(dateFrom);
    dateFromLte.setDate(dateFromLte.getDate() + 3);
    const dateFromGte = new Date(dateFrom);
    dateFromGte.setDate(dateFromGte.getDate() - 3);
    const dateToLte = new Date(dateTo);
    dateToLte.setDate(dateToLte.getDate() + 3);
    const dateToGte = new Date(dateTo);
    dateToGte.setDate(dateToGte.getDate() - 3);

    const flats = await prisma.flat.findMany({
      where: {
        address: {
          city,
        },
        dateFrom: {
          lte: dateFromLte,
          gte: dateFromGte,
        },
        dateTo: {
          lte: dateToLte,
          gte: dateToGte,
        },
        swapWithCity: hometown,
      },
      include: {
        address: true,
      },
    });

    return NextResponse.json(flats);
  }
}
