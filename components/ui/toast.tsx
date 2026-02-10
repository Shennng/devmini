import * as React from "react";
import { cn } from "@/lib/utils";

const ToastProvider = ({ children }: { children: React.ReactNode }) => <div className="fixed top-0 right-0 z-[100] flex flex-col p-4 gap-2 max-w-md">{children}</div>;

const Toast = ({ children, className, ...props }: any) => <div className={cn("rounded-lg border border-border bg-background p-4 shadow-lg", className)} {...props}>{children}</div>;

const ToastTitle = ({ children, className, ...props }: any) => <div className={cn("text-sm font-semibold", className)} {...props}>{children}</div>;

const ToastDescription = ({ children, className, ...props }: any) => <div className={cn("text-sm opacity-90", className)} {...props}>{children}</div>;

const ToastClose = ({ children, ...props }: any) => <button className="absolute right-2 top-2 text-muted-foreground hover:text-foreground" {...props}>✕</button>;

export { ToastProvider, Toast, ToastTitle, ToastDescription, ToastClose };
