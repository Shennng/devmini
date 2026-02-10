"use client";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";
import { Copy, ArrowRightLeft, Calculator, RefreshCw } from "lucide-react";

type Base = 2 | 8 | 10 | 16;

const baseLabels: Record<Base, string> = { 2: "二进制", 8: "八进制", 10: "十进制", 16: "十六进制" };
const basePrefixes: Record<Base, string> = { 2: "0b", 8: "0o", 10: "", 16: "0x" };

function convert(value: string, fromBase: Base, toBases: Base[]): Record<Base, string> {
  if (!value.trim()) return { 2: "", 8: "", 10: "", 16: "" };
  try {
    const decimal = parseInt(value, fromBase);
    if (isNaN(decimal) || decimal < 0) throw new Error("无效数字");
    const result: Record<Base, string> = {} as Record<Base, string>;
    toBases.forEach(base => {
      const val = base === 16 ? decimal.toString(16).toUpperCase() : decimal.toString(base);
      result[base] = basePrefixes[base] + val;
    });
    return result;
  } catch { return { 2: "无效输入", 8: "无效输入", 10: "无效输入", 16: "无效输入" }; }
}

export default function BaseConvertPage() {
  const [input, setInput] = useState("");
  const [inputBase, setInputBase] = useState<Base>(10);
  const [results, setResults] = useState<Record<Base, string>>({ 2: "", 8: "", 10: "", 16: "" });
  const { toast } = useToast();

  const process = useCallback(() => {
    const bases: Base[] = [2, 8, 10, 16];
    setResults(convert(input, inputBase, bases));
  }, [input, inputBase]);

  useEffect(() => { process(); }, [process]);

  const copy = async (value: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      toast({ title: "已复制到剪贴板" });
    } catch { toast({ title: "复制失败" }); }
  };

  const clear = () => { setInput(""); };

  const swapBase = () => {
    const labels: Base[] = [2, 8, 10, 16];
    const currentIndex = labels.indexOf(inputBase);
    setInputBase(labels[(currentIndex + 1) % 4]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] lg:h-[calc(100vh-3.5rem)]">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <Calculator className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">进制转换</span>
        </div>
        <Button variant="ghost" size="sm" onClick={swapBase}>
          <ArrowRightLeft className="h-4 w-4 mr-1" />切换输入进制 ({baseLabels[inputBase]})
        </Button>
      </div>

      <div className="p-4 border-b border-border">
        <Label className="text-sm font-medium mb-2 block">输入 ({baseLabels[inputBase]})</Label>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`输入 ${baseLabels[inputBase]} 数字...`}
            className="flex-1 bg-background border border-border rounded-lg px-4 py-3 font-mono text-lg outline-none focus:border-primary"
          />
          <Button variant="outline" onClick={clear}>清空</Button>
        </div>
      </div>

      <div className="flex-1 p-4 grid grid-cols-2 lg:grid-cols-4 gap-4 content-start">
        {Object.entries(baseLabels).map(([base, label]) => {
          const b = Number(base) as Base;
          const value = results[b] || "";
          const isHighlight = b === inputBase;
          return (
            <div key={b} className={`border rounded-lg p-4 ${isHighlight ? "border-primary bg-primary/5" : "border-border"}`}>
              <Label className="text-xs text-muted-foreground mb-2 block">{label}</Label>
              <div className="font-mono text-lg break-all min-h-[2rem]">{value || "—"}</div>
              {value && !value.startsWith("无效") && (
                <Button variant="ghost" size="sm" className="mt-2 w-full" onClick={() => copy(value)}>
                  <Copy className="h-3 w-3 mr-1" />复制
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <div className="px-6 py-2 border-t border-border text-xs text-muted-foreground">
        提示: 支持大/小写十六进制 (A-F/a-f)
      </div>
    </div>
  );
}
