import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import PatientsAdminClient from "./PatientsAdminClient";

export default async function PatientsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const supabase = createAdminClient();
  const { data: patients, count } = await supabase
    .from("patient_recipients")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <PatientsAdminClient
      initialPatients={patients || []}
      totalCount={count || 0}
    />
  );
}
