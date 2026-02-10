"use client";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";
import { Copy, Calendar, AlertCircle, Clock } from "lucide-react";

function parseCron(cron: string): { nextRuns: string[]; human: string } | null {
  const parts = cron.trim().split(/\s+/);
  if (parts.length < 5) return null;

  const [, minute, hour, , , week] = [...parts, "*", "*", "*", "*"].slice(0, 6);

  const nextRuns: string[] = [];
  const now = new Date();

  for (let i = 0; i < 5; i++) {
    const next = new Date(now);
    next.setMinutes(parseInt(minute) || 0);
    next.setHours(parseInt(hour) || 0);
    next.setDate(next.getDate() + i + 1);
    next.setSeconds(0);
    next.setMilliseconds(0);

    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }

    nextRuns.push(next.toLocaleString("zh-CN", {
      year: "numeric", month: "2-digit", day: "2-digit", weekday: "short", hour: "2-digit", minute: "2-digit"
    }));
  }

  const human = `每${minute !== "*" ? `${minute}分` : ""}${hour !== "*" ? `${hour}时` : ""}执行`;
  return { nextRuns, human };
}

function describeCron(cron: string): string {
  const parts = cron.trim().split(/\s+/);
  if (parts.length < 5) return "无效的 Cron 表达式";

  const [sec, minute, hour, dom, month, dow] = parts;
  const descriptions: string[] = [];

  const describeField = (value: string, type: "minute" | "hour" | "dom" | "month" | "dow") => {
    if (value === "*") return null;
    const labels: Record<string, string[]> = {
      month: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
      dow: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
    };
    return `${labels[type]?.[parseInt(value) - 1] || value}`;
  };

  if (minute !== "*") descriptions.push(`每 ${minute} 分钟`);
  if (hour !== "*") descriptions.push(`每 ${hour} 小时`);
  if (dom !== "*") descriptions.push(`每月 ${dom} 号`);
  if (month !== "*") descriptions.push(`${describeField(month, "month")} 月`);
  if (dow !== "*") descriptions.push(`周${describeField(dow, "dow")}`);

  return descriptions.length > 0 ? descriptions.join("，") : "每分钟执行";
}

export default function CronParserPage() {
  const [cron, setCron] = useState("* * * * *");
  const [parsed, setParsed] = useState<{ nextRuns: string[]; human: string } | null>(null);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const process = useCallback(() => {
    if (!cron.trim()) { setParsed(null); setError(""); return; }
    const result = parseCron(cron);
    if (result) { setParsed(result); setError(""); }
    else { setParsed(null); setError("无效的 Cron 格式"); }
  }, [cron]);

  useEffect(() => { process(); }, [process]);

  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); toast({ title: "已复制" }); }
    catch { toast({ title: "复制失败" }); }
  };

  const commonCrons = [
    { label: "每分钟", value: "* * * * *" },
    { label: "每小时", value: "0 * * * *" },
    { label: "每天凌晨", value: "0 0 * * *" },
    { label: "每周一", value: "0 0 * * 1" },
    { label: "每月1号", value: "0 0 1 * *" },
    { label: "每5分钟", value: "*/5 * * * *" },
    { label: "每小时30分", value: "30 * * * *" }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] lg:h-[calc(100vh-3.5rem)]">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Cron 解析</span>
        </div>
      </div>

      {/* 输入区 */}
      <div className="p-4 border-b border-border">
        <Label className="text-sm font-medium mb-2 block">Cron 表达式</Label>
        <input
          type="text"
          value={cron}
          onChange={e => setCron(e.target.value)}
          placeholder="* * * * * (秒 可选)"
          className="w-full bg-background border border-border rounded-lg px-4 py-3 font-mono text-lg outline-none focus:border-primary mb-3"
        />

        {/* 常用表达式 */}
        <Label className="text-xs text-muted-foreground mb-2 block">常用表达式</Label>
        <div className="flex flex-wrap gap-2">
          {commonCrons.map(item => (
            <button key={item.value} onClick={() => setCron(item.value)} className="px-3 py-1 bg-muted hover:bg-muted/80 rounded-full text-xs transition-colors">
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 错误提示 */}
      {error && <div className="px-6 py-3 bg-red-500/10 text-red-400 text-sm flex items-center gap-2"><AlertCircle className="h-4 w-4" />{error}</div>}

      {parsed && (
        <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-auto">
          {/* 解析说明 */}
          <div className="border border-border rounded-lg p-4">
            <Label className="text-xs text-muted-foreground mb-3 block">解析结果</Label>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-muted-foreground">含义:</span>
                <p className="font-medium mt-1">{describeCron(cron)}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">格式:</span>
                <code className="block mt-1 p-2 bg-muted/20 rounded font-mono text-sm">{cron}</code>
              </div>
            </div>
          </div>

          {/* 下次执行时间 */}
          <div className="border border-border rounded-lg p-4">
            <Label className="text-xs text-muted-foreground mb-3 block">最近 5 次执行时间</Label>
            <div className="space-y-2">
              {parsed.nextRuns.map((time, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-muted/20 rounded">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-mono text-sm">{time}</span>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => copy(parsed.nextRuns.join("\n"))}>
              <Copy className="h-4 w-4 mr-1" />复制所有时间
            </Button>
          </div>
        </div>
      )}

      {/* 帮助 */}
      <div className="px-6 py-3 border-t border-border text-xs text-muted-foreground">
        <p className="font-medium mb-1">Cron 格式: 秒(可选) 分 时 日 月 周</p>
        <p>支持: * / , - 如 "*/5" 每5分钟, "1,3,5" 第1,3,5分钟, "1-3" 第1到3分钟</p>
      </div>
    </div>
  );
}
