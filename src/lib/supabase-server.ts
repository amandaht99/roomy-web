import "server-only";

import { createClient } from "@supabase/supabase-js";

const STORAGE_BUCKET = "flat-images";

function getRequiredEnv(name: "SUPABASE_URL" | "SUPABASE_SERVICE_ROLE_KEY") {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getSupabaseServerClient() {
  return createClient(
    getRequiredEnv("SUPABASE_URL"),
    getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
  );
}

export function getFlatImagePublicUrls(
  imagePaths: string[] | null | undefined,
) {
  const supabase = getSupabaseServerClient();

  return (imagePaths ?? []).map((path) => {
    const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  });
}
