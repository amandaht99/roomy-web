import { NextRequest } from "next/server";
import { prisma } from "../../../../../prisma/db";
import { clerkClient } from "@clerk/nextjs";

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

export async function GET(
  request: NextRequest,
  { params }: { params: { flatId: string } }
) {
  const parsedFlatId = parseInt(params.flatId);
  const flat = await prisma.flat.findUnique({
    where: {
      id: parsedFlatId,
    },
    include: {
      address: true,
    },
  });

  if (flat?.ownerId) {
    const user = await clerkClient.users.getUser(flat.ownerId);
    return Response.json({ ...flat, owner: user });
  }
}

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { flatId: string } }
// ) {
//   try {
//     const deletedFlat = await prisma.flat.delete({
//       where: {
//         id: parseInt(params.flatId),
//       },
//     });

//     await deleteImages(deletedFlat.imagesPaths);

//     set.status = 204;
//     return;
//   } catch (error) {
//     console.error(error);
//     return error;
//   }
// }
