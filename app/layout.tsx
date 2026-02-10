"use client";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ToolBar, MobileNav } from "@/components/toolbar";
import { ThemeToggle } from "@/components/theme-toggle";
import { ThemeProvider } from "next-themes";
import { Toaster, ToastProvider } from "@/lib/hooks/use-toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetBrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ToastProvider>
            <LayoutContent>{children}</LayoutContent>
          </ToastProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <ToolBar className="hidden lg:flex fixed top-0 left-0 right-0 z-50" />
      <div className="flex-1 flex flex-col min-w-0 lg:pt-[3.5rem]">
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-4 h-14 lg:hidden">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-sm">DM</div>
            <span className="font-semibold">DevMini</span>
          </a>
          <MobileNav />
        </header>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
