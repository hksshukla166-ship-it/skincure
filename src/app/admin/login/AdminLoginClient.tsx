"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 p-4">
      <div className="w-full max-w-md rounded-2xl p-6 bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">SKIN CURE Admin</h1>
          <p className="text-primary-300 mt-2">Sign in to manage your clinic</p>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
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
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-200 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
          <button
            type="submit"
            className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-gold-600 to-gold-400 text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-primary-900" />}>
      <LoginForm />
    </Suspense>
  );
}
