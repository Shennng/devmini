"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CommandMenu } from "@/components/command-menu";
import { motion } from "framer-motion";
import { Braces, Clock, Lock, Globe, FileJson, Type, Palette, ArrowRight, Zap, Shield, Smartphone, ChevronRight } from "lucide-react";

const featuredTools = [
  { href: "/json-format", title: "JSON 格式化", desc: "格式化、压缩、验证、修复", icon: Braces, color: "text-yellow-400" },
  { href: "/timestamp", title: "时间戳转换", desc: "Unix ↔ 人类可读时间", icon: Clock, color: "text-blue-400" },
  { href: "/base64", title: "Base64 编码", desc: "编码/解码/文件转换", icon: Lock, color: "text-green-400" },
  { href: "/url-encode", title: "URL 编码", desc: "编码/解码/参数解析", icon: Globe, color: "text-purple-400" },
  { href: "/hash", title: "哈希生成", desc: "MD5 / SHA-256 / SHA-512", icon: FileJson, color: "text-red-400" },
  { href: "/base-convert", title: "进制转换", desc: "2/8/10/16进制互转", icon: Type, color: "text-cyan-400" },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Dev<span className="text-primary">Mini</span></h1>
            <p className="mt-4 text-lg text-muted-foreground">极简、极速、纯前端的开发者工具箱</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-8 flex justify-center">
            <div className="w-full max-w-md"><CommandMenu /></div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-6 flex justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Shield className="h-4 w-4" />纯前端 · 零上传</span>
            <span className="flex items-center gap-1"><Zap className="h-4 w-4" />首屏 &lt;0.8s</span>
            <span className="flex items-center gap-1"><Smartphone className="h-4 w-4" />PWA 支持</span>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">常用工具</h2>
          <Link href="/tools" className="text-sm text-primary hover:underline flex items-center gap-1">查看全部<ChevronRight className="h-4 w-4" /></Link>
        </div>
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredTools.map((tool) => (
            <motion.div key={tool.href} variants={itemVariants}>
              <Link href={tool.href}>
                <Card className="group h-full cursor-pointer transition-all duration-200 hover:border-primary/50 hover:shadow-md">
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <tool.icon className={`h-6 w-6 ${tool.color}`} />
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardHeader>
                  <CardContent><CardTitle className="text-base">{tool.title}</CardTitle><p className="mt-1 text-sm text-muted-foreground">{tool.desc}</p></CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-8 text-center text-sm text-muted-foreground">
          <p>DevMini © 2026 · 100% 纯前端 · 数据不上传服务器</p>
        </div>
      </footer>
    </div>
  );
}
