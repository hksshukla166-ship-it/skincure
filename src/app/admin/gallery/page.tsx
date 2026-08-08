import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import GalleryAdminClient from "./GalleryAdminClient";

export default async function GalleryAdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const supabase = createAdminClient();
  const { data } = await supabase.from("gallery").select("*").order("sort_order");
  return <GalleryAdminClient items={data || []} />;
}
