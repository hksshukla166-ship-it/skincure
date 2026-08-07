import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  dark?: boolean;
}

export function GlassCard({ children, className, hover = true, dark = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        dark ? "glass-dark" : "glass",
        "rounded-2xl p-6",
        hover && "transition-all duration-300 hover:shadow-premium hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
}
