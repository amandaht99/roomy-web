import { db } from "../../db";
import { flats, addresses } from "../../db/schema";
import { eq, ne, inArray } from "drizzle-orm";

export async function getAllFlats(userId: string) {
  const flatRows = await db
    .select()
    .from(flats)
    .where(ne(flats.ownerId, userId));

  // Fetch addresses for all returned flats
  const flatIds = flatRows.map((f) => f.id);
  const addressMap: Record<number, typeof addresses.$inferSelect> = {};
  if (flatIds.length > 0) {
    const addressRows = await db
      .select()
      .from(addresses)
      .where(inArray(addresses.flatId, flatIds));
    addressRows.forEach((addr) => {
      addressMap[addr.flatId] = addr;
    });
  }

  // Merge addresses into flats
  return flatRows.map((flat) => ({
    ...flat,
    address: addressMap[flat.id] || null,
  }));
}

export async function putFlatDate(
  flatId: string,
  body: { type: string; date: string },
) {
  try {
    const flatIdNum = parseInt(flatId);
    const updateData =
      body?.type === "From"
        ? { dateFrom: new Date(body.date) }
        : { dateTo: new Date(body.date) };

    // Update the flat
    await db.update(flats).set(updateData).where(eq(flats.id, flatIdNum));

    // Fetch updated flat
    const flatRows = await db
      .select()
      .from(flats)
      .where(eq(flats.id, flatIdNum))
      .limit(1);
    const flat = flatRows[0];

    if (!flat) {
      return null;
    }

    // Fetch related address
    const addressRows = await db
      .select()
      .from(addresses)
      .where(eq(addresses.flatId, flat.id))
      .limit(1);
    const address = addressRows[0] ?? null;

    return { ...flat, address };
  } catch (e) {
    // Record not found or other error
    return null;
  }
}
