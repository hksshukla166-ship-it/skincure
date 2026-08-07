"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Calendar, Image, Stethoscope, MessageSquare,
  Settings, Clock, FileText, HelpCircle, LogOut, Menu, X, Bell, Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/lib/actions";
import { useState } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Appointments", icon: Calendar },
  { href: "/admin/patients", label: "Patients", icon: Users },
  { href: "/admin/broadcasts", label: "Broadcasts", icon: Bell },
  { href: "/admin/doctor", label: "Doctor", icon: Stethoscope },
  { href: "/admin/gallery", label: "Gallery", icon: Image },
  { href: "/admin/services", label: "Services", icon: Stethoscope },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { href: "/admin/slots", label: "Time Slots", icon: Clock },
  { href: "/admin/blogs", label: "Blog", icon: FileText },
  { href: "/admin/faq", label: "FAQ", icon: HelpCircle },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await logoutAction();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-primary-900 text-white transform transition-transform lg:transform-none",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 border-b border-primary-800">
          <h1 className="font-display text-xl font-bold text-gold-400">SKIN CURE</h1>
          <p className="text-primary-400 text-sm">Admin Portal</p>
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors",
                  active ? "bg-primary-700 text-gold-400" : "text-primary-200 hover:bg-primary-800"
                )}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-primary-800 w-full transition-colors"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button className="lg:hidden p-2" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="font-semibold text-primary-900 capitalize">
            {pathname.split("/").pop()?.replace("-", " ") || "Dashboard"}
          </h2>
          <Link href="/" className="text-sm text-primary-600 hover:text-primary-800">
            View Website →
          </Link>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
