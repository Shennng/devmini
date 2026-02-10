"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Braces, Clock, Lock, Globe, FileJson, Type, Key, Search, Palette, ChevronDown } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

const categories = [
  { name: "数据格式", tools: [
    { href: "/json-format", label: "JSON 格式化", icon: Braces },
    { href: "/csv-json", label: "CSV ↔ JSON", icon: FileJson },
    { href: "/yaml-json", label: "YAML ↔ JSON", icon: FileJson },
  ]},
  { name: "编码转换", tools: [
    { href: "/base64", label: "Base64", icon: Lock },
    { href: "/url-encode", label: "URL 编码", icon: Globe },
    { href: "/base-convert", label: "进制转换", icon: Type },
  ]},
  { name: "时间处理", tools: [
    { href: "/timestamp", label: "时间戳", icon: Clock },
  ]},
  { name: "加密安全", tools: [
    { href: "/hash", label: "哈希生成", icon: FileJson },
    { href: "/jwt-decode", label: "JWT 解码", icon: Key },
  ]},
  { name: "开发者工具", tools: [
    { href: "/regex", label: "正则测试", icon: Search },
    { href: "/color", label: "颜色转换", icon: Palette },
  ]},
];

export function ToolBar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside className={cn("fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur", className)}>
      <div className="flex h-14 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-sm">DM</div>
          <span className="font-bold text-lg tracking-tight text-foreground">Dev<span className="text-primary">Mini</span></span>
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-2">
            {categories.map((c) => (
              <div key={c.name} className="relative group">
                <div className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer">
                  <span>{c.name}</span>
                  <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
                </div>
                <div className="absolute top-full right-0 mt-1 w-48 rounded-md border border-border bg-background shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 -translate-y-2">
                  <div className="p-2">
                    <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">{c.name}</div>
                    <div className="grid grid-cols-1 gap-1">
                      {c.tools.map((t) => {
                        const Icon = t.icon;
                        const isActive = pathname === t.href;
                        return (
                          <Link key={t.href} href={t.href} className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all", isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted hover:text-foreground")}>
                            <Icon className="h-4 w-4 text-foreground" />
                            <span className="text-foreground">{t.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}

export function MobileNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => setIsOpen(!isOpen);

  const handleLinkClick = () => setIsOpen(false);

  return (
    <div className={cn("relative lg:hidden", className)}>
      <button
        onClick={toggleNav}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background hover:bg-muted"
      >
        <div className="flex flex-col gap-1.5 items-center justify-center">
          <span className={cn("block h-0.5 w-6 bg-current transition-all", isOpen ? "rotate-45 translate-y-2" : "")} />
          <span className={cn("block h-0.5 w-6 bg-current transition-all", isOpen ? "opacity-0" : "")} />
          <span className={cn("block h-0.5 w-6 bg-current transition-all", isOpen ? "-rotate-45 -translate-y-2" : "")} />
        </div>
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-64 rounded-md border border-border bg-background shadow-lg z-50 overflow-hidden">
            <div className="p-4 space-y-4">
              {categories.map((c) => (
                <div key={c.name}>
                  <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">{c.name}</div>
                  <div className="mt-1 space-y-1">
                    {c.tools.map((t) => {
                      const Icon = t.icon;
                      const isActive = pathname === t.href;
                      return (
                        <Link 
                          key={t.href} 
                          href={t.href} 
                          onClick={handleLinkClick}
                          className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all", isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted hover:text-foreground")}
                        >
                          <Icon className="h-4 w-4 text-foreground" />
                          <span className="text-foreground">{t.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
              <div className="pt-4 border-t border-border mt-4">
                <div className="flex items-center justify-between px-3">
                  <span className="text-sm font-medium">主题</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
