import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import FAQAdminClient from "./FAQAdminClient";

export default async function FAQAdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const supabase = createAdminClient();
  const { data } = await supabase.from("faq").select("*").order("sort_order");
  return <FAQAdminClient faqs={data || []} />;
}
