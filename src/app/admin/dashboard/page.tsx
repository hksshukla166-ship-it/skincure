import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDashboardStats, getNotifications } from "@/lib/data";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const [stats, notifications] = await Promise.all([
    getDashboardStats(),
    getNotifications(),
  ]);

  return <DashboardClient stats={stats} notifications={notifications} />;
}
