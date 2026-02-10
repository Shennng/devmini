"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";
import { Copy, Search, Trash2, Plus, Flag } from "lucide-react";

type FlagOption = "g" | "i" | "m" | "s" | "u" | "y";

const flagLabels: Record<FlagOption, string> = { g: "全局", i: "忽略大小写", m: "多行", s: "DotAll", u: "Unicode", y: "粘性" };

export default function RegexPage() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState<FlagOption[]>(["g"]);
  const [input, setInput] = useState("");
  const [matches, setMatches] = useState<RegExpExecArray[]>([]);
  const [error, setError] = useState("");
  const [replacement, setReplacement] = useState("");
  const [replaceResult, setReplaceResult] = useState("");
  const { toast } = useToast();

  const regex = useMemo(() => {
    if (!pattern) return null;
    try { return new RegExp(pattern, flags.join("")); }
    catch (e) { setError((e as Error).message); return null; }
  }, [pattern, flags]);

  useEffect(() => {
    if (!regex || !input) { setMatches([]); setReplaceResult(""); return; }
    setError("");
    const results: RegExpExecArray[] = [];
    let match: RegExpExecArray | null;
    const str = input;
    const tempRegex = new RegExp(regex.source, flags.includes("g") ? regex.source : regex.source + "g");
    while ((match = tempRegex.exec(str)) !== null) {
      results.push(match);
      if (!flags.includes("g")) break;
    }
    setMatches(results);
    setReplaceResult("");
  }, [regex, input, flags]);

  const toggleFlag = (flag: FlagOption) => {
    setFlags(prev => prev.includes(flag) ? prev.filter(f => f !== flag) : [...prev, flag]);
  };

  const performReplace = () => {
    if (!regex || !input) return;
    try { setReplaceResult(input.replace(regex, replacement || "")); }
    catch { toast({ title: "替换失败", description: "正则表达式无效" }); }
  };

  const clear = () => { setPattern(""); setInput(""); setMatches([]); setReplaceResult(""); setError(""); };

  const copyMatches = async () => {
    const text = matches.map((m, i) => `Match ${i + 1}: "${m[0]}" (位置: ${m.index})`).join("\n");
    try { await navigator.clipboard.writeText(text); toast({ title: "已复制匹配结果" }); }
    catch { toast({ title: "复制失败" }); }
  };

  const highlightText = () => {
    if (!regex || !input) return input;
    const parts: { text: string; match: boolean }[] = [];
    let lastIndex = 0;
    matches.forEach(m => {
      if (m.index > lastIndex) parts.push({ text: input.slice(lastIndex, m.index), match: false });
      parts.push({ text: m[0], match: true });
      lastIndex = m.index + m[0].length;
    });
    if (lastIndex < input.length) parts.push({ text: input.slice(lastIndex), match: false });
    return parts.map((p, i) => p.match ? `<mark class="bg-primary/30">${escapeHtml(p.text)}</mark>` : escapeHtml(p.text)).join("");
  };

  const escapeHtml = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] lg:h-[calc(100vh-3.5rem)]">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">正则测试</span>
        </div>
        <Button variant="ghost" size="sm" onClick={clear}><Trash2 className="h-4 w-4" />清空</Button>
      </div>

      {/* 正则输入区 */}
      <div className="p-4 border-b border-border gap-4 flex flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <Label className="text-xs mb-1 block">正则表达式</Label>
          <div className="flex gap-2">
            <span className="flex items-center px-3 bg-muted rounded-l-lg border border-r-0 border-border font-mono">/</span>
            <input
              type="text"
              value={pattern}
              onChange={e => setPattern(e.target.value)}
              placeholder="输入正则..."
              className="flex-1 bg-background border border-border px-2 py-2 font-mono outline-none focus:border-primary"
            />
            <span className="flex items-center px-3 bg-muted rounded-r-lg border border-l-0 border-border font-mono">/</span>
          </div>
        </div>
        <div>
          <Label className="text-xs mb-1 block">标志</Label>
          <div className="flex gap-1">
            {(["g", "i", "m"] as FlagOption[]).map(flag => (
              <button key={flag} onClick={() => toggleFlag(flag)} className={`px-2 py-1 rounded border text-xs ${flags.includes(flag) ? "bg-primary text-primary-foreground" : "bg-background border-border"}`}>
                {flag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 错误提示 */}
      {error && <div className="px-6 py-2 bg-red-500/10 text-red-400 text-sm">{error}</div>}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
        {/* 测试文本 */}
        <div className="flex flex-col p-4 gap-2">
          <Label className="text-sm font-medium flex justify-between">测试文本 <span className="text-xs text-muted-foreground">{matches.length} 个匹配</span></Label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="输入测试文本..."
            className="flex-1 bg-background border border-border rounded-lg p-4 font-mono text-sm resize-none outline-none focus:border-primary"
          />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyMatches} disabled={matches.length === 0}>复制匹配</Button>
          </div>
        </div>

        {/* 替换 */}
        <div className="flex flex-col p-4 gap-2">
          <Label className="text-sm font-medium">替换</Label>
          <div className="flex gap-2">
            <input
              type="text"
              value={replacement}
              onChange={e => setReplacement(e.target.value)}
              placeholder="替换为..."
              className="flex-1 bg-background border border-border rounded-lg px-4 py-2 font-mono text-sm outline-none focus:border-primary"
            />
            <Button onClick={performReplace} disabled={!regex}>替换</Button>
          </div>
          {replaceResult && (
            <div className="flex-1 bg-muted/10 border border-border rounded-lg p-4 overflow-auto">
              <Label className="text-xs text-muted-foreground mb-2 block">替换结果</Label>
              <pre className="font-mono text-sm whitespace-pre-wrap break-all">{replaceResult}</pre>
            </div>
          )}
        </div>
      </div>

      {/* 匹配结果列表 */}
      {matches.length > 0 && (
        <div className="border-t border-border p-4 max-h-48 overflow-auto">
          <Label className="text-xs mb-2 block">匹配详情</Label>
          <div className="space-y-2">
            {matches.map((m, i) => (
              <div key={i} className="flex items-center gap-4 p-2 bg-muted/20 rounded text-sm">
                <span className="text-muted-foreground w-12">#{i + 1}</span>
                <code className="flex-1 font-mono">{escapeHtml(m[0])}</code>
                <span className="text-muted-foreground text-xs">位置: {m.index}</span>
                {m.length > 1 && <span className="text-muted-foreground text-xs">分组: {m.length - 1}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
