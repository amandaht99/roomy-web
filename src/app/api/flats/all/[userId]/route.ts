import { NextRequest, NextResponse } from "next/server";
import { getAllFlats } from "@/controllers/flats";
import { withLogging } from "@/lib/withLogging";
import { logger } from "@/lib/logger";

async function handleGET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  logger.debug("Fetching all flats except user", { userId });
  const flatsList = await getAllFlats(userId);
  logger.debug("Flats fetched", { count: flatsList.length, userId });

  return NextResponse.json(flatsList);
}

export const GET = withLogging(handleGET, "GET /api/flats/all/[userId]");
