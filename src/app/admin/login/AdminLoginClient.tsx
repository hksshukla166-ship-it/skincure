"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";

export default function AdminLoginClient() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.error) {
        toast.error(data.error || "Login failed. Please try again.");
        setLoading(false);
        return;
      }

      window.location.href = "/admin/dashboard";
    } catch {
      toast.error("Could not reach the server. Restart the site and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 p-4">
      <GlassCard className="w-full max-w-md dark" dark>
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">SKIN CURE Admin</h1>
          <p className="text-primary-300 mt-2">Sign in to manage your clinic</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-primary-200 mb-1">Username</label>
            <input
              type="text"
              name="username"
              required
              autoComplete="username"
              defaultValue="ASkiNcare"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-200 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
              placeholder="Enter password"
            />
          </div>
          <Button type="submit" variant="gold" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
          </Button>
        </form>
      </GlassCard>
    </div>
  );
}
