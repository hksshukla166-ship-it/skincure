import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import SlotsAdminClient from "./SlotsAdminClient";

export default async function SlotsAdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const supabase = createAdminClient();
  const [{ data: slots }, { data: holidays }] = await Promise.all([
    supabase.from("appointment_slots").select("*").order("sort_order"),
    supabase.from("holiday_schedule").select("*").order("date"),
  ]);
  return <SlotsAdminClient slots={slots || []} holidays={holidays || []} />;
}
