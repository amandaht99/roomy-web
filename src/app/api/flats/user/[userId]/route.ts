import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../../db";
import { clerkClient } from "@clerk/nextjs";
import { flats, addresses } from "../../../../../../db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  // find flat by ownerId
  const flatRows = await db.select().from(flats).where(eq(flats.ownerId, params.userId)).limit(1);
  const flat = flatRows[0];

  if (!flat) {
    return NextResponse.json(null, { status: 404 });
  }

  // fetch related address (one-to-one)
  const addressRows = await db.select().from(addresses).where(eq(addresses.flatId, flat.id)).limit(1);
  const address = addressRows[0] ?? null;

  const user = await clerkClient.users.getUser(flat.ownerId);
  return NextResponse.json({ ...flat, address, owner: user });
}