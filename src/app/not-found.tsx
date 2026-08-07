import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white">
      <div className="text-center px-4">
        <h1 className="font-display text-6xl font-bold text-primary-900 mb-4">404</h1>
        <p className="text-primary-600 text-lg mb-8">Page not found</p>
        <Link href="/">
          <Button variant="primary">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
