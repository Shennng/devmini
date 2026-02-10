"use client";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";
import { Copy, RefreshCw, Download, Grid, List } from "lucide-react";

type UUIDVersion = "v1" | "v4" | "v7";

function generateUUID(version: UUIDVersion): string {
  switch (version) {
    case "v4":
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        const v = c === "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    case "v7":
      const timestamp = Date.now();
      const timestampHex = Math.floor(timestamp).toString(16).padStart(12, "0");
      const random = "xxxxxxxxxxxx".replace(/[xy]/g, c => {
        const r = Math.random() * 16 | 0;
        return r.toString(16);
      });
      return `${timestampHex.substring(0, 8)}-${timestampHex.substring(8, 12)}-7${random.substring(1, 4)}-${(parseInt(random[0], 16) & 0x3 | 0x8).toString(16)}${random.substring(5, 12)}-${random.substring(12)}`;
    case "v1":
    default:
      const now = Date.now();
      const clock = Math.random() * 10000 | 0;
      return "xxxxxxxx-xxxx-1xxx-8xxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
        if (c === "x") {
          const r = (now + clock) * 16 | 0;
          return (r % 16).toString(16);
        }
        return ((now + clock) / 16 | 0 % 16).toString(16);
      });
  }
}

export default function UuidPage() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);
  const [version, setVersion] = useState<UUIDVersion>("v4");
  const [uppercase, setUppercase] = useState(false);
  const [braces, setBraces] = useState(true);
  const { toast } = useToast();

  const generate = useCallback(() => {
    const list = Array.from({ length: count }, () => generateUUID(version));
    setUuids(list.map(u => {
      let result = u;
      if (uppercase) result = result.toUpperCase();
      if (!braces) result = result.replace(/-/g, "");
      return result;
    }));
  }, [count, version, uppercase, braces]);

  useEffect(() => { generate(); }, [generate]);

  const copyAll = async () => {
    try { await navigator.clipboard.writeText(uuids.join("\n")); toast({ title: "已复制所有 UUID" }); }
    catch { toast({ title: "复制失败" }); }
  };

  const copyOne = async (uuid: string) => {
    try { await navigator.clipboard.writeText(uuid); toast({ title: "已复制" }); }
    catch { toast({ title: "复制失败" }); }
  };

  const download = () => {
    const content = uuids.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `uuids-${version}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "文件已下载" });
  };

  const versionLabels: Record<UUIDVersion, string> = { v1: "v1 (时间戳)", v4: "v4 (随机)", v7: "v7 (时间排序)" };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] lg:h-[calc(100vh-3.5rem)]">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <Grid className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">UUID 生成</span>
        </div>
        <Button variant="ghost" size="sm" onClick={generate}>
          <RefreshCw className="h-4 w-4 mr-1" />重新生成
        </Button>
      </div>

      {/* 设置区 */}
      <div className="p-4 border-b border-border grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label className="text-xs mb-1 block">版本</Label>
          <select value={version} onChange={e => setVersion(e.target.value as UUIDVersion)} className="w-full bg-background border border-border rounded px-3 py-2 text-sm">
            <option value="v4">v4 (随机)</option>
            <option value="v1">v1 (时间戳)</option>
            <option value="v7">v7 (时间排序)</option>
          </select>
        </div>
        <div>
          <Label className="text-xs mb-1 block">数量</Label>
          <input type="number" value={count} onChange={e => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))} className="w-full bg-background border border-border rounded px-3 py-2 text-sm" min={1} max={100} />
        </div>
        <div className="flex items-end gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)} className="rounded" />
            <span className="text-sm">大写</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={braces} onChange={e => setBraces(e.target.checked)} className="rounded" />
            <span className="text-sm">带连字符</span>
          </label>
        </div>
        <div className="flex items-end gap-2">
          <Button variant="outline" size="sm" onClick={copyAll} disabled={uuids.length === 0} className="flex-1">
            <Copy className="h-4 w-4 mr-1" />复制全部
          </Button>
          <Button variant="outline" size="sm" onClick={download} disabled={uuids.length === 0}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 结果区 */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="space-y-2">
          {uuids.map((uuid, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg group">
              <span className="text-muted-foreground text-sm w-8">{i + 1}.</span>
              <code className="flex-1 font-mono text-sm">{uuid}</code>
              <Button variant="ghost" size="sm" onClick={() => copyOne(uuid)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-2 border-t border-border text-xs text-muted-foreground">
        版本说明: v4 随机生成最常用 | v1 基于时间戳 | v7 时间排序便于索引
      </div>
    </div>
  );
}
