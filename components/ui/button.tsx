import * as React from "react";
import { cn } from "@/lib/utils";

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string, size?: string }>(({ className, variant = "default", size = "default", ...props }, ref) => (
  <button ref={ref} className={cn("inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50",
    variant === "default" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-transparent border border-border hover:bg-muted",
    size === "default" ? "h-9 px-4 py-2" : size === "sm" ? "h-8 px-3" : "h-10 px-8",
    className)} {...props} />
));
Button.displayName = "Button";

export { Button };
