"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-2xl border border-primary-100 bg-white p-8 text-center shadow-lg">
        <h1 className="text-xl font-bold text-primary-900 mb-2">Something went wrong</h1>
        <p className="text-primary-600 mb-6 text-sm">
          {error.message || "Please refresh and try again."}
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 rounded-xl bg-primary-800 text-white font-medium hover:bg-primary-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
