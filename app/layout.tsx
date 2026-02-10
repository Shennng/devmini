"use client";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ToolBar } from "@/components/toolbar";
import { MobileNav } from "@/components/mobile-nav";
import { Toaster } from "@/components/ui/toaster";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <LayoutContent>{children}</LayoutContent>
        <Toaster />
      </body>
    </html>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      <ToolBar collapsed={collapsed} className="hidden lg:flex" />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-4 h-14 lg:hidden">
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-sm">DM</div>
            <span className="font-semibold">DevMini</span>
          </a>
          <MobileNav />
        </header>
        <main className="flex-1">{children}</main>
      </div>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50 bg-primary text-primary-foreground p-1 rounded-r shadow-lg hidden lg:block"
        style={{ left: collapsed ? "0" : "220px", transition: "left 0.3s" }}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </div>
  );
}
