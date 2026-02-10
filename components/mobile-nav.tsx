"use client";
import * as React from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, Grid } from "lucide-react";

const tools = [
  { href: "/json-format", label: "JSON 格式化" },
  { href: "/timestamp", label: "时间戳转换" },
  { href: "/base64", label: "Base64 编码" },
  { href: "/url-encode", label: "URL 编码" },
  { href: "/hash", label: "哈希生成" },
  { href: "/base-convert", label: "进制转换" },
  { href: "/color", label: "颜色转换" },
  { href: "/regex", label: "正则测试" },
];

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-sm">DM</div>
            <span>DevMini</span>
          </div>
        </div>
        <nav className="mt-4 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-muted">
            <Home className="h-4 w-4" />首页
          </Link>
          <Link href="/tools" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-muted">
            <Grid className="h-4 w-4" />所有工具
          </Link>
          <div className="pt-4 border-t border-border">
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase">工具</div>
            {tools.map((t) => (
              <Link key={t.href} href={t.href} className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
                {t.label}
              </Link>
            ))}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
