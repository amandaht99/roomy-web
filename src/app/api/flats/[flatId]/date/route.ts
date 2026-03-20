import { NextRequest, NextResponse } from "next/server";
import { putFlatDate } from "@/controllers/flats";
import { withLogging } from "@/lib/withLogging";
import { logger } from "@/lib/logger";
import { auth } from "@clerk/nextjs/server";
import { db } from "../../../../../../db";
import { flats } from "../../../../../../db/schema";
import { and, eq } from "drizzle-orm";

async function handlePUT(
  request: NextRequest,
  { params }: { params: Promise<{ flatId: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  const { flatId } = await params;
  const parsedFlatId = parseInt(flatId, 10);
  if (!Number.isInteger(parsedFlatId) || parsedFlatId <= 0) {
    return NextResponse.json({ error: "Invalid flatId" }, { status: 400 });
  }

  const flatRows = await db
    .select({ id: flats.id, ownerId: flats.ownerId })
    .from(flats)
    .where(eq(flats.id, parsedFlatId))
    .limit(1);
  const flat = flatRows[0];

  if (!flat) {
    logger.warn("Flat not found", { flatId: parsedFlatId });
    return NextResponse.json({ error: "Flat not found" }, { status: 404 });
  }

  if (flat.ownerId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  logger.debug("Updating flat date", { flatId, ...body });
  const updatedFlat = await putFlatDate(flatId, body);
  return NextResponse.json(updatedFlat);
}

export const PUT = withLogging(handlePUT, "PUT /api/flats/[flatId]/date");
