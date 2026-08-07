import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getSettings } from "@/lib/data";
import SettingsAdminClient from "./SettingsAdminClient";

export default async function SettingsAdminPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  const settings = await getSettings();
  return <SettingsAdminClient settings={settings} />;
}
