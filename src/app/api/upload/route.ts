import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  getFlatImagePublicUrls,
  getSupabaseServerClient,
} from "@/lib/supabase-server";
import { withLogging } from "@/lib/withLogging";
import { logger } from "@/lib/logger";

const STORAGE_BUCKET = "flat-images";
const MAX_FILES = 3;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function sanitizeFileName(fileName: string) {
  return fileName
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "");
}

async function handlePOST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }

  const formData = await request.formData();
  const flatIdRaw = formData.get("flatId");

  if (typeof flatIdRaw !== "string" || !flatIdRaw.trim()) {
    return NextResponse.json({ error: "flatId is required" }, { status: 400 });
  }

  const flatId = Number.parseInt(flatIdRaw, 10);
  if (!Number.isInteger(flatId) || flatId <= 0) {
    return NextResponse.json(
      { error: "flatId must be a positive integer" },
      { status: 400 },
    );
  }

  const files = formData
    .getAll("images")
    .filter((value): value is File => value instanceof File);

  if (files.length === 0) {
    return NextResponse.json(
      { error: "At least one image is required" },
      { status: 400 },
    );
  }

  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { error: `You can upload up to ${MAX_FILES} images.` },
      { status: 400 },
    );
  }

  for (const file of files) {
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: jpeg, png, webp." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "Each image must be 5MB or smaller." },
        { status: 400 },
      );
    }
  }

  const supabase = getSupabaseServerClient();
  const uploadedPaths: string[] = [];

  try {
    for (const file of files) {
      const sanitizedName = sanitizeFileName(file.name || "image");
      const timestamp = Date.now();
      const path = `${userId}/${flatId}/${timestamp}-${sanitizedName}`;
      const bytes = new Uint8Array(await file.arrayBuffer());

      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, bytes, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        logger.error("Failed to upload image", {
          userId,
          flatId,
          path,
          error,
        });
        throw new Error(error.message);
      }

      uploadedPaths.push(path);
    }

    const publicUrls = getFlatImagePublicUrls(uploadedPaths);

    return NextResponse.json(
      { imagesPaths: uploadedPaths, images: publicUrls },
      { status: 201 },
    );
  } catch (error) {
    logger.error("Upload endpoint failed", { userId, flatId, error });
    return NextResponse.json(
      { error: "Failed to upload images" },
      { status: 500 },
    );
  }
}

export const POST = withLogging(handlePOST, "POST /api/upload");
