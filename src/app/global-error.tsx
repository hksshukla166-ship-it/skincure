"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-primary-900 p-4">
        <div className="max-w-md w-full rounded-2xl bg-white/10 border border-white/20 p-8 text-center text-white">
          <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
          <p className="text-primary-200 mb-2 text-sm">
            {error.message || "The site hit a temporary server error."}
          </p>
          {error.digest && (
            <p className="text-primary-300 mb-6 text-xs">Reference: {error.digest}</p>
          )}
          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className="px-4 py-2 rounded-xl bg-gold-500 text-primary-900 font-medium hover:opacity-90"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => { window.location.href = "/"; }}
              className="px-4 py-2 rounded-xl border border-white/30 font-medium hover:bg-white/10"
            >
              Go home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
