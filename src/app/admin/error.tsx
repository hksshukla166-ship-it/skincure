"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border p-8 text-center">
        <h1 className="text-xl font-bold text-primary-900 mb-2">Something went wrong</h1>
        <p className="text-gray-600 mb-6 text-sm">{error.message || "An unexpected error occurred."}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-xl bg-primary-800 text-white font-medium hover:bg-primary-700"
          >
            Try again
          </button>
          <a
            href="/admin/login"
            className="px-4 py-2 rounded-xl border border-gray-300 text-primary-900 font-medium hover:bg-gray-50"
          >
            Back to login
          </a>
        </div>
      </div>
    </div>
  );
}
