import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import BroadcastsAdminClient from "./BroadcastsAdminClient";

export default async function BroadcastsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const supabase = createAdminClient();
  const [{ data: broadcasts }, { count: patientCount }] = await Promise.all([
    supabase.from("broadcasts").select("*").order("created_at", { ascending: false }),
    supabase
      .from("patient_recipients")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
  ]);

  return (
    <BroadcastsAdminClient
      initialBroadcasts={broadcasts || []}
      activePatientCount={patientCount || 0}
      whatsappConfigured={Boolean(
        process.env.WHATSAPP_CLOUD_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID
      )}
    />
  );
}
