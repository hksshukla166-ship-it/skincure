import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getDashboardStats, getNotifications } from "@/lib/data";
import DashboardClient from "./DashboardClient";
import type { DashboardStats, Notification } from "@/types";

const EMPTY_STATS: DashboardStats = {
  totalAppointments: 0,
  todayBookings: 0,
  upcomingAppointments: 0,
  cancelledAppointments: 0,
  completedAppointments: 0,
  galleryCount: 0,
  visitorCount: 0,
  pendingAppointments: 0,
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  let stats: DashboardStats = EMPTY_STATS;
  let notifications: Notification[] = [];

  try {
    [stats, notifications] = await Promise.all([
      getDashboardStats(),
      getNotifications(),
    ]);
  } catch {
    // Show dashboard with empty stats instead of crashing
  }

  return <DashboardClient stats={stats} notifications={notifications} />;
}
