import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { initializeAdmin } from "@/lib/auth";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await initializeAdmin();
  const { error } = await searchParams;

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

        {error && (
          <div className="mb-5 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {decodeURIComponent(error)}
          </div>
        )}

        <form action="/api/admin/login" method="POST" className="space-y-5">
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
              defaultValue="SAskinCare134@1"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
              placeholder="Enter password"
            />
          </div>
          <Button type="submit" variant="gold" className="w-full">
            Sign In
          </Button>
        </form>
      </GlassCard>
    </div>
  );
}
