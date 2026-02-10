"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";
import { Copy, Clock, RefreshCw, Calendar, Trash2, CheckCircle, AlertCircle } from "lucide-react";

type FormatOption = "default" | "dateOnly" | "timeOnly" | "iso" | "chinese" | "utc" | "unix";

interface FormatInfo {
  label: string;
  options: Intl.DateTimeFormatOptions;
}

const formats: Record<FormatOption, FormatInfo> = {
  default: { label: "默认", options: { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" } },
  dateOnly: { label: "仅日期", options: { year: "numeric", month: "2-digit", day: "2-digit" } },
  timeOnly: { label: "仅时间", options: { hour: "2-digit", minute: "2-digit", second: "2-digit" } },
  iso: { label: "ISO 24h", options: { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false } },
  chinese: { label: "中文格式", options: { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false } },
  utc: { label: "UTC", options: { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "UTC" } },
  unix: { label: "Unix 毫秒", options: { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false } }
};

export default function TimestampPage() {
  const [timestamp, setTimestamp] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [format, setFormat] = useState<FormatOption>("default");
  const [isValid, setIsValid] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  let liveInterval: NodeJS.Timeout;

  const now = useCallback(() => {
    const ts = Math.floor(Date.now() / 1000);
    setTimestamp(ts.toString());
    updateDateTime(ts);
    setIsLive(true);
  }, []);

  useEffect(() => {
    now();
    // 启动实时更新
    liveInterval = setInterval(() => {
      if (isLive) {
        const ts = Math.floor(Date.now() / 1000);
        setTimestamp(ts.toString());
        updateDateTime(ts);
      }
    }, 1000);
    return () => clearInterval(liveInterval);
  }, [now, isLive]);

  function updateDateTime(ts: number | string) {
    try {
      const tsNum = typeof ts === "string" ? parseInt(ts) : ts;
      if (isNaN(tsNum) || tsNum < 0) {
        setIsValid(false);
        return;
      }
      const ms = tsNum * (format === "unix" ? 1 : 1000);
      setDateTime(new Date(ms).toLocaleString("zh-CN", formats[format]?.options || formats.default.options));
      setIsValid(true);
    } catch {
      setIsValid(false);
      setDateTime("无效时间戳");
    }
  }

  function updateTimestamp(dt: string) {
    try {
      const date = new Date(dt);
      if (isNaN(date.getTime())) {
        setIsValid(false);
        return;
      }
      const ts = Math.floor(date.getTime() / 1000);
      setTimestamp(ts.toString());
      updateDateTime(ts);
      setIsValid(true);
    } catch {
      setIsValid(false);
    }
  }

  useEffect(() => { if (timestamp) updateDateTime(timestamp); }, [timestamp, format]);

  const copy = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "已复制到剪贴板" });
    } catch { toast({ title: "复制失败", description: "请手动选择复制" }); }
  };

  const clear = () => {
    setIsLive(false);
    setTimestamp("");
    setDateTime("");
    setIsValid(true);
    inputRef.current?.focus();
    toast({ title: "已清空" });
  };

  const toggleLive = () => {
    setIsLive(!isLive);
    toast({ title: isLive ? "已暂停实时更新" : "已开启实时更新" });
  };

  const copyMs = () => {
    const ts = parseInt(timestamp);
    if (!isNaN(ts)) {
      copy((ts * 1000).toString());
    }
  };

  // 快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "Enter") { e.preventDefault(); now(); }
        else if (e.key === "b") { e.preventDefault(); clear(); }
        else if (e.key === "l") { e.preventDefault(); toggleLive(); }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [now, isLive]);

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] lg:h-[calc(100vh-3.5rem)]">
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">时间戳转换</span>
          {isLive && <span className="flex items-center gap-1 text-xs text-green-400"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />实时</span>}
        </div>
        <div className="flex items-center gap-2">
          <select value={format} onChange={e => setFormat(e.target.value as FormatOption)} className="bg-background border border-border rounded px-2 py-1 text-xs">
            {Object.entries(formats).map(([key, info]) => (
              <option key={key} value={key}>{info.label}</option>
            ))}
          </select>
          <Button variant="ghost" size="sm" onClick={toggleLive} title="切换实时 (Ctrl+L)" className={isLive ? "text-green-400" : ""}>
            <Calendar className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={clear} title="清空 (Ctrl+B)"><Trash2 className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={now} title="刷新 (Ctrl+Enter)"><RefreshCw className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
        {/* 时间戳输入 */}
        <div className="flex flex-col min-h-0">
          <div className="flex items-center justify-between px-4 py-1 border-b border-border/50 bg-muted/10">
            <span className="text-xs font-medium text-muted-foreground">Unix 时间戳 (秒)</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={copyMs} disabled={!timestamp} className="h-5 text-xs">复制毫秒</Button>
              <Button variant="ghost" size="sm" onClick={() => copy(timestamp)} disabled={!timestamp} className="h-5 text-xs">复制</Button>
            </div>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={timestamp}
            onChange={e => { setTimestamp(e.target.value); updateDateTime(e.target.value); setIsLive(false); }}
            placeholder="输入时间戳..."
            className="flex-1 p-4 bg-transparent outline-none font-mono text-lg"
          />
        </div>

        {/* 日期时间显示 */}
        <div className="flex flex-col min-h-0">
          <div className="flex items-center justify-between px-4 py-1 border-b border-border/50 bg-muted/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">人类可读时间</span>
              {dateTime && isValid && <span className="flex items-center gap-1 text-xs text-green-400"><CheckCircle className="h-3 w-3" />有效</span>}
              {!isValid && <span className="flex items-center gap-1 text-xs text-red-400"><AlertCircle className="h-3 w-3" />无效</span>}
            </div>
            <Button variant="ghost" size="sm" onClick={() => copy(dateTime)} disabled={!dateTime} className="h-5 text-xs">复制</Button>
          </div>
          <div className="flex-1 p-4 flex items-center">
            <span className={`font-mono text-lg ${!isValid ? "text-red-400" : ""}`}>{dateTime || "等待输入..."}</span>
          </div>
        </div>
      </div>

      {/* 状态栏 */}
      <div className="flex items-center justify-between px-4 py-1 border-t border-border text-xs text-muted-foreground bg-muted/10">
        <span>{timestamp ? `当前: ${timestamp}` : "等待输入..."}</span>
        <span>快捷键: Ctrl+Enter 刷新 | Ctrl+B 清空 | Ctrl+L 实时切换</span>
      </div>
    </div>
  );
}
