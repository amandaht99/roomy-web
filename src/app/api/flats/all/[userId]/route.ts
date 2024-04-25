import { NextRequest, NextResponse } from "next/server";
import { getAllFlats } from "@/controllers/flats";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  const flats = await getAllFlats(params.userId);

  return NextResponse.json(flats);
}
