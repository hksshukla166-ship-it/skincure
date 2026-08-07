import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDoctor } from "@/lib/data";
import DoctorAdminClient from "./DoctorAdminClient";

export default async function DoctorAdminPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const doctor = await getDoctor();
  return <DoctorAdminClient doctor={doctor} />;
}
