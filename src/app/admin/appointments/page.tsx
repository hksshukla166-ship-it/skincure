import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllAppointments } from "@/lib/data";
import AppointmentsClient from "./AppointmentsClient";

export default async function AppointmentsPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const appointments = await getAllAppointments();
  return <AppointmentsClient initialAppointments={appointments} />;
}
