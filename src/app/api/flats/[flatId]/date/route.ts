import { NextRequest, NextResponse } from "next/server";
import { putFlatDate } from "@/controllers/flats";

export async function PUT(
  request: NextRequest,
  { params }: { params: { flatId: string } }
) {
  const body = await request.json();
  const flat = await putFlatDate(params.flatId, body);
  return NextResponse.json(flat);
}
