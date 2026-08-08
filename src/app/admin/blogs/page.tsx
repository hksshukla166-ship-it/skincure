import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import BlogsAdminClient from "./BlogsAdminClient";

export default async function BlogsAdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const supabase = createAdminClient();
  const { data } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
  return <BlogsAdminClient blogs={data || []} />;
}
