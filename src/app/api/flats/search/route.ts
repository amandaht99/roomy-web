import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../db";
import { flats, addresses } from "../../../../../db/schema";
import { eq, and, lte, gte, inArray } from "drizzle-orm";
import { withLogging } from "@/lib/withLogging";
import { logger } from "@/lib/logger";
import { getFlatImagePublicUrls } from "@/lib/supabase-server";

async function handlePOST(request: NextRequest) {
  const body = await request.json();
  const filters = body?.filters;
  logger.debug("Search request received", { filters });
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

    // First, find all addresses matching the city
    const matchingAddresses = await db
      .select({ flatId: addresses.flatId })
      .from(addresses)
      .where(eq(addresses.city, city));

    const flatIdsFromAddress = matchingAddresses.map((a) => a.flatId);

    if (flatIdsFromAddress.length === 0) {
      return NextResponse.json([]);
    }

    // Now find flats matching all filters
    const flatRows = await db
      .select()
      .from(flats)
      .where(
        and(
          inArray(flats.id, flatIdsFromAddress),
          gte(flats.dateFrom, dateFromGte),
          lte(flats.dateFrom, dateFromLte),
          gte(flats.dateTo, dateToGte),
          lte(flats.dateTo, dateToLte),
          eq(flats.swapWithCity, hometown),
        ),
      );

    // Fetch addresses for all returned flats
    const addressRows = await db
      .select()
      .from(addresses)
      .where(
        inArray(
          addresses.flatId,
          flatRows.map((f) => f.id),
        ),
      );

    const addressMap: Record<number, typeof addresses.$inferSelect> = {};
    addressRows.forEach((addr) => {
      addressMap[addr.flatId] = addr;
    });

    // Merge addresses into flats
    const flatData = flatRows.map((flat) => ({
      ...flat,
      images: getFlatImagePublicUrls(flat.imagesPaths),
      address: addressMap[flat.id] || null,
    }));

    logger.debug("Search completed", { resultCount: flatData.length, filters });
    return NextResponse.json(flatData);
  }
  logger.warn("Search request missing filters");
  return NextResponse.json([]);
}

export const POST = withLogging(handlePOST, "POST /api/flats/search");
