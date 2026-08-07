import { createAdminClient } from "./admin";

export const STORAGE_BUCKETS = [
  { id: "doctor-images", public: true, name: "Doctor Images" },
  { id: "gallery", public: true, name: "Gallery" },
  { id: "videos", public: true, name: "Videos" },
  { id: "testimonials", public: true, name: "Testimonials" },
  { id: "blogs", public: true, name: "Blogs" },
  { id: "certificates", public: true, name: "Certificates" },
  { id: "logo", public: true, name: "Clinic Logo" },
] as const;

export type StorageBucketId = (typeof STORAGE_BUCKETS)[number]["id"];

export async function ensureStorageBuckets(): Promise<{ created: string[]; existing: string[]; errors: string[] }> {
  const supabase = createAdminClient();
  const created: string[] = [];
  const existing: string[] = [];
  const errors: string[] = [];

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    errors.push(`Failed to list buckets: ${listError.message}`);
    return { created, existing, errors };
  }

  const existingIds = new Set(buckets?.map((b) => b.id) ?? []);

  for (const bucket of STORAGE_BUCKETS) {
    if (existingIds.has(bucket.id)) {
      existing.push(bucket.id);
      continue;
    }

    const { error } = await supabase.storage.createBucket(bucket.id, {
      public: bucket.public,
      fileSizeLimit: 52428800,
    });

    if (error) {
      if (error.message.includes("already exists")) {
        existing.push(bucket.id);
      } else {
        errors.push(`${bucket.id}: ${error.message}`);
      }
    } else {
      created.push(bucket.id);
    }
  }

  return { created, existing, errors };
}
