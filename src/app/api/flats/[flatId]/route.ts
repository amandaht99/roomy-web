import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "../../../../../db";
import { flats, addresses } from "../../../../../db/schema";
import { eq } from "drizzle-orm";
import { withLogging } from "@/lib/withLogging";
import { logger } from "@/lib/logger";
import {
  getFlatImagePublicUrls,
  getSupabaseServerClient,
} from "@/lib/supabase-server";

// export async function CREATE(
//     request: NextRequest,
//     { params }: { params: { userId: string } }
//   ) {
//     try {
//       // If images were uploaded, handle image upload to Supabase
//       const imagesPaths =
//         uploadedFlat.images && uploadedFlat.images.length > 0
//           ? await uploadImages(uploadedFlat.images, userId, set)
//           : [];

//       const createdFlat = await prisma.flat.create({
//         data: {
//           address: {
//             create: {
//               city: uploadedFlat.address.city,
//               street: uploadedFlat.address.street,
//               country: uploadedFlat.address.country,
//             },
//           },
//           ownerId: params.userId,
//           dateFrom: uploadedFlat.dateFrom,
//           dateTo: uploadedFlat.dateTo,
//           swapWithCity: uploadedFlat.swapWithCity,
//           description: uploadedFlat.description ? uploadedFlat.description : null,
//           rooms: uploadedFlat.rooms ? parseInt(uploadedFlat.rooms) : null,
//           imagesPaths: imagesPaths,
//         },
//       });

//       const urls = await getPublicImageUrls(createdFlat.imagesPaths);

//       const flatWithImages = await prisma.flat.update({
//         where: {
//           id: createdFlat.id,
//         },
//         data: {
//           images: urls,
//         },
//         include: {
//           address: true,
//         },
//       });

//       set.status = 201;
//       return flatWithImages;
//     } catch (error) {
//       console.error(error);
//       return error;
//     }
//   };

async function handleGET(
  request: NextRequest,
  { params }: { params: Promise<{ flatId: string }> },
) {
  const { flatId } = await params;
  const parsedFlatId = parseInt(flatId, 10);
  logger.debug("Fetching flat", { flatId: parsedFlatId });

  const flatRows = await db
    .select()
    .from(flats)
    .where(eq(flats.id, parsedFlatId))
    .limit(1);
  const flat = flatRows[0];

  if (!flat) {
    logger.warn("Flat not found", { flatId: parsedFlatId });
    return NextResponse.json({ error: "Flat not found" }, { status: 404 });
  }

  logger.debug("Flat found", { id: flat.id, ownerId: flat.ownerId });

  // Fetch related address (one-to-one)
  const addressRows = await db
    .select()
    .from(addresses)
    .where(eq(addresses.flatId, flat.id))
    .limit(1);
  const address = addressRows[0] ?? null;

  if (flat.ownerId) {
    const client = await clerkClient();
    const user = await client.users.getUser(flat.ownerId);
    return NextResponse.json({
      ...flat,
      images: getFlatImagePublicUrls(flat.imagesPaths),
      address,
      owner: user,
    });
  }

  return NextResponse.json({
    ...flat,
    images: getFlatImagePublicUrls(flat.imagesPaths),
    address,
  });
}

export const GET = withLogging(handleGET, "GET /api/flats/[flatId]");

async function handleDELETE(
  request: NextRequest,
  { params }: { params: Promise<{ flatId: string }> },
) {
  const { flatId } = await params;
  const parsedFlatId = parseInt(flatId, 10);

  if (!Number.isInteger(parsedFlatId) || parsedFlatId <= 0) {
    return NextResponse.json({ error: "Invalid flatId" }, { status: 400 });
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  const flatRows = await db
    .select({
      id: flats.id,
      ownerId: flats.ownerId,
      imagesPaths: flats.imagesPaths,
    })
    .from(flats)
    .where(eq(flats.id, parsedFlatId))
    .limit(1);
  const flat = flatRows[0];

  if (!flat) {
    return NextResponse.json({ error: "Flat not found" }, { status: 404 });
  }

  if (flat.ownerId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = getSupabaseServerClient();
  if (flat.imagesPaths.length > 0) {
    const { error: storageError } = await supabase
      .storage
      .from("flat-images")
      .remove(flat.imagesPaths);

    if (storageError) {
      logger.warn("Failed to remove flat images from storage", {
        flatId: parsedFlatId,
        imagesPaths: flat.imagesPaths,
        error: storageError,
      });
    }
  }

  await db.delete(flats).where(eq(flats.id, parsedFlatId));
  logger.info("Flat deleted", { flatId: parsedFlatId, userId });

  return new NextResponse(null, { status: 204 });
}

export const DELETE = withLogging(handleDELETE, "DELETE /api/flats/[flatId]");
