"use client";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";
import { Copy, Globe, RefreshCw, ArrowRightLeft } from "lucide-react";

type Mode = "encode" | "decode";

export default function UrlEncodePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("encode");
  const [safeMode, setSafeMode] = useState(false);
  const { toast } = useToast();

  const process = useCallback((value: string, currentMode: Mode) => {
    if (!value.trim()) { setOutput(""); return; }
    try {
      if (currentMode === "encode") {
        setOutput(safeMode ? encodeURIComponent(value) : encodeURI(value));
      } else {
        setOutput(decodeURI(value));
      }
    } catch (e) {
      setOutput("解码失败: URL 格式错误");
    }
  }, [safeMode]);

  const handleInputChange = (value: string) => {
    setInput(value);
    process(value, mode);
  };

  const toggleMode = () => {
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    setInput(output);
    setOutput("");
  };

  const copy = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "已复制到剪贴板" });
    } catch { toast({ title: "复制失败" }); }
  };

  const clear = () => {
    setInput("");
    setOutput("");
    toast({ title: "已清空" });
  };

  const paste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      process(text, mode);
      toast({ title: "已粘贴" });
    } catch { toast({ title: "粘贴失败" }); }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] lg:h-[calc(100vh-3.5rem)]">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">URL {mode === "encode" ? "编码" : "解码"}</span>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input type="checkbox" checked={safeMode} onChange={e => setSafeMode(e.target.checked)} className="rounded" />
            完整编码 (safe mode)
          </label>
          <Button variant="ghost" size="sm" onClick={toggleMode}>
            <ArrowRightLeft className="h-4 w-4 mr-1" />切换
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
        <div className="flex flex-col p-4 gap-2">
          <Label className="text-sm font-medium flex justify-between">
            <span>{mode === "encode" ? "原文" : "URL 字符串"}</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={paste}>粘贴</Button>
              <Button variant="ghost" size="sm" onClick={clear}>清空</Button>
            </div>
          </Label>
          <textarea
            value={input}
            onChange={e => handleInputChange(e.target.value)}
            placeholder={mode === "encode" ? "输入要编码的 URL..." : "输入编码后的 URL..."}
            className="flex-1 bg-background border border-border rounded-lg p-4 font-mono text-sm resize-none outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-col p-4 gap-2">
          <Label className="text-sm font-medium flex justify-between">
            <span>{mode === "encode" ? "编码结果" : "解码结果"}</span>
            <Button variant="ghost" size="sm" onClick={() => copy(output)} disabled={!output}>
              <Copy className="h-4 w-4 mr-1" />复制
            </Button>
          </Label>
          <textarea
            value={output}
            readOnly
            placeholder="结果..."
            className={`flex-1 bg-muted/10 border border-border rounded-lg p-4 font-mono text-sm resize-none outline-none ${output.startsWith("解码失败") ? "text-red-400" : ""}`}
          />
        </div>
      </div>

      <div className="px-6 py-2 border-t border-border text-xs text-muted-foreground">
        区别: encodeURI 保留 / ? # 等字符 | encodeURIComponent 会完全编码
      </div>
    </div>
  );
}
