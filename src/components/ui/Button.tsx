"use client";

import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { forwardRef, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "gold" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const variants = {
      primary: "btn-primary",
      gold: "btn-gold",
      outline: "btn-outline",
      ghost: "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-primary-700 hover:bg-primary-50 transition-colors",
      danger: "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors",
    };

    const sizes = {
      sm: "text-sm px-4 py-2",
      md: "text-base",
      lg: "text-lg px-8 py-4",
    };

    return (
      <Comp
        className={cn(variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button };
