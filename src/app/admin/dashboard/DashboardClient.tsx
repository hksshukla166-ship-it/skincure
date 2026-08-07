"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import {
  Calendar, Users, Image, Clock, CheckCircle, XCircle, AlertCircle, Bell
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import type { DashboardStats, Notification } from "@/types";

interface DashboardClientProps {
  stats: DashboardStats;
  notifications: Notification[];
}

const COLORS = ["#1e3a8a", "#3b82f6", "#d4af37", "#ef4444", "#22c55e"];

export default function DashboardClient({ stats, notifications }: DashboardClientProps) {
  const chartData = [
    { name: "Pending", value: stats.pendingAppointments },
    { name: "Approved", value: stats.upcomingAppointments },
    { name: "Completed", value: stats.completedAppointments },
    { name: "Cancelled", value: stats.cancelledAppointments },
  ];

  const barData = [
    { name: "Today", bookings: stats.todayBookings },
    { name: "Total", bookings: stats.totalAppointments },
    { name: "Upcoming", bookings: stats.upcomingAppointments },
    { name: "Gallery", bookings: stats.galleryCount },
  ];

  const statCards = [
    { label: "Today's Bookings", value: stats.todayBookings, icon: Calendar, color: "from-blue-500 to-blue-600" },
    { label: "Pending", value: stats.pendingAppointments, icon: AlertCircle, color: "from-yellow-500 to-yellow-600" },
    { label: "Upcoming", value: stats.upcomingAppointments, icon: Clock, color: "from-green-500 to-green-600" },
    { label: "Completed", value: stats.completedAppointments, icon: CheckCircle, color: "from-emerald-500 to-emerald-600" },
    { label: "Cancelled", value: stats.cancelledAppointments, icon: XCircle, color: "from-red-500 to-red-600" },
    { label: "Total Patients", value: stats.totalAppointments, icon: Users, color: "from-purple-500 to-purple-600" },
    { label: "Gallery Items", value: stats.galleryCount, icon: Image, color: "from-pink-500 to-pink-600" },
    { label: "Visitors", value: stats.visitorCount, icon: Users, color: "from-indigo-500 to-indigo-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-2xl font-bold text-primary-900">{card.value}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-primary-900 mb-4">Appointment Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="bookings" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-primary-900 mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-primary-900 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" /> Recent Notifications
        </h3>
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications yet</p>
        ) : (
          <div className="space-y-3">
            {notifications.slice(0, 10).map((n) => (
              <div key={n.id} className={`p-4 rounded-xl border ${n.is_read ? "bg-gray-50 border-gray-100" : "bg-blue-50 border-blue-100"}`}>
                <p className="font-medium text-primary-900">{n.title}</p>
                <p className="text-sm text-gray-600">{n.message}</p>
                <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString("en-IN")}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
