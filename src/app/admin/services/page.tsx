import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import ServicesAdminClient from "./ServicesAdminClient";

export default async function ServicesAdminPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const supabase = createAdminClient();
  const { data } = await supabase.from("services").select("*").order("sort_order");
  return <ServicesAdminClient services={data || []} />;
}
