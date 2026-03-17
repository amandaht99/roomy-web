import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../../db";
import { clerkClient } from "@clerk/nextjs/server";
import { flats, addresses } from "../../../../../../db/schema";
import { eq } from "drizzle-orm";
import { withLogging } from "@/lib/withLogging";
import { logger } from "@/lib/logger";

async function handleGET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  logger.debug("Fetching flat by ownerId", { userId });
  // find flat by ownerId
  const flatRows = await db
    .select()
    .from(flats)
    .where(eq(flats.ownerId, userId))
    .limit(1);
  const flat = flatRows[0];

  if (!flat) {
    logger.warn("No flat found for user", { userId });
    return NextResponse.json(null, { status: 404 });
  }

  logger.debug("Flat found for user", { userId, flatId: flat.id });

  // fetch related address (one-to-one)
  const addressRows = await db
    .select()
    .from(addresses)
    .where(eq(addresses.flatId, flat.id))
    .limit(1);
  const address = addressRows[0] ?? null;

  const client = await clerkClient();
  const user = await client.users.getUser(flat.ownerId);

  return NextResponse.json({ ...flat, address, owner: user });
}

export const GET = withLogging(handleGET, "GET /api/flats/user/[userId]");

async function handlePOST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  logger.debug("Create flat request", { userId });

  const body = await request.json();

  try {
    // Prepare flat data
    const flatToInsert = {
      ownerId: userId,
      description: body.description ?? null,
      squareMeters: body.squareMeters ?? null,
      rooms: body.rooms ?? null,
      images: body.images ?? [],
      dateFrom: body.dateFrom ? new Date(body.dateFrom) : new Date(),
      dateTo: body.dateTo ? new Date(body.dateTo) : new Date(),
      swapWithCity: body.swapWithCity ?? "",
      imagesPaths: body.imagesPaths ?? [],
    } as const;

    // Insert flat
    const inserted = await db
      .insert(flats)
      .values(flatToInsert)
      .returning();

    const createdFlat = inserted[0];

    // If address provided, create it and link via flatId
    let address = null;
    if (body.address && createdFlat?.id) {
      const addrInsert = await db
        .insert(addresses)
        .values({
          street: body.address.street ?? "",
          city: body.address.city ?? "",
          country: body.address.country ?? "",
          flatId: createdFlat.id,
        })
        .returning();

      address = addrInsert[0] ?? null;
    }

    // Fetch owner info from Clerk if available
    let owner = null;
    if (createdFlat?.ownerId) {
      const client = await clerkClient();
      owner = await client.users.getUser(createdFlat.ownerId);
    }

    logger.info("Flat created", { flatId: createdFlat?.id, userId });

    return NextResponse.json({ ...createdFlat, address, owner }, { status: 201 });
  } catch (err) {
    logger.error("Failed to create flat", { error: err });
    return NextResponse.json({ error: "Failed to create flat" }, { status: 500 });
  }
}

export const POST = withLogging(handlePOST, "POST /api/flats/user/[userId]");
