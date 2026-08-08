import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import TestimonialsAdminClient from "./TestimonialsAdminClient";

export default async function TestimonialsAdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const supabase = createAdminClient();
  const { data } = await supabase.from("testimonials").select("*").order("sort_order");
  return <TestimonialsAdminClient testimonials={data || []} />;
}
