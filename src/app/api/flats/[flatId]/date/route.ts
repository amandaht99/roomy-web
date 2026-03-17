import { NextRequest, NextResponse } from "next/server";
import { putFlatDate } from "@/controllers/flats";
import { withLogging } from "@/lib/withLogging";
import { logger } from "@/lib/logger";

async function handlePUT(
  request: NextRequest,
  { params }: { params: Promise<{ flatId: string }> },
) {
  const { flatId } = await params;
  const body = await request.json();
  logger.debug("Updating flat date", { flatId, ...body });
  const flat = await putFlatDate(flatId, body);
  if (!flat) {
    logger.warn("Failed to update flat date", { flatId });
    return NextResponse.json({ error: "Flat not found" }, { status: 404 });
  }
  return NextResponse.json(flat);
}

export const PUT = withLogging(handlePUT, "PUT /api/flats/[flatId]/date");
