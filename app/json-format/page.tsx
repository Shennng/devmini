"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";
import { Copy, Download, Check, AlertCircle, Trash2, ArrowDownToLine, ArrowUpFromLine, FileJson } from "lucide-react";

type IndentOption = 2 | 4 | "tab";

export default function JsonFormatPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState<IndentOption>(2);
  const [mode, setMode] = useState<"format" | "minify">("format");
  const [isValid, setIsValid] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const processJSON = useCallback((value: string) => {
    if (!value.trim()) {
      setOutput("");
      setIsValid(true);
      setErrorMsg("");
      return;
    }

    try {
      const parsed = JSON.parse(value);
      if (mode === "format") {
        setOutput(JSON.stringify(parsed, null, indent));
      } else {
        setOutput(JSON.stringify(parsed));
      }
      setIsValid(true);
      setErrorMsg("");
    } catch (e) {
      setIsValid(false);
      setErrorMsg((e as Error).message);
      setOutput("");
    }
  }, [mode, indent]);

  useEffect(() => { processJSON(input); }, [input, processJSON]);

  const copy = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "已复制到剪贴板" });
    } catch { toast({ title: "复制失败", description: "请手动选择复制" }); }
  };

  const download = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "output.json";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "文件已下载" });
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setIsValid(true);
    setErrorMsg("");
    textareaRef.current?.focus();
    toast({ title: "已清空" });
  };

  const fixJSON = () => {
    try {
      // 尝试修复常见错误
      let fixed = input
        .replace(/'/g, '"')
        .replace(/(\w+):/g, '"$1":')
        .replace(/,\s*}/g, "}")
        .replace(/,\s*\]/g, "]");
      setInput(fixed);
      toast({ title: "已尝试修复", description: "检查结果是否正确" });
    } catch { toast({ title: "修复失败", description: "请手动检查" }); }
  };

  const sampleJSON = () => {
    const sample = { name: "DevMini", version: "1.0.0", features: ["JSON格式化", "Base64编解码", "时间戳转换"], author: "DevMini" };
    setInput(JSON.stringify(sample, null, 2));
    toast({ title: "已加载示例" });
  };

  const getCursorPosition = () => {
    const el = textareaRef.current;
    if (!el) return null;
    return { line: el.value.substr(0, el.selectionStart).split("\n").length, column: el.selectionStart - el.value.lastIndexOf("\n", el.selectionStart - 1) - 1 };
  };

  // 快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "Enter") { e.preventDefault(); copy(output); }
        else if (e.key === "b") { e.preventDefault(); clear(); }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [output, copy, clear]);

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] lg:h-[calc(100vh-3.5rem)]">
      {/* 页面标题 */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <FileJson className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">JSON 格式化</span>
        </div>
      </div>

      {/* 工具栏 */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Label className="text-xs mr-1">缩进:</Label>
            <select value={indent} onChange={e => setIndent(e.target.value as IndentOption)} className="bg-background border border-border rounded px-2 py-1 text-xs">
              <option value={2}>2 空格</option>
              <option value={4}>4 空格</option>
              <option value="tab">Tab</option>
            </select>
          </div>
          <div className="flex items-center gap-1">
            <Label className="text-xs mr-1">模式:</Label>
            <select value={mode} onChange={e => setMode(e.target.value as "format" | "minify")} className="bg-background border border-border rounded px-2 py-1 text-xs">
              <option value="format">格式化</option>
              <option value="minify">压缩</option>
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={sampleJSON} title="加载示例"><FileJson className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={fixJSON} title="尝试修复" disabled={!input}><ArrowDownToLine className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={clear} title="清空 (Ctrl+B)"><Trash2 className="h-4 w-4" /></Button>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
        {/* 输入区 */}
        <div className="flex flex-col min-h-0">
          <div className="flex items-center justify-between px-4 py-1 border-b border-border/50 bg-muted/10">
            <span className="text-xs font-medium text-muted-foreground">输入</span>
            {input && <Button variant="ghost" size="sm" onClick={clear} className="h-5 text-xs">清空</Button>}
          </div>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="粘贴 JSON..."
            className="flex-1 p-4 bg-transparent outline-none font-mono text-sm resize-none"
            spellCheck={false}
          />
        </div>

        {/* 输出区 */}
        <div className="flex flex-col min-h-0">
          <div className="flex items-center justify-between px-4 py-1 border-b border-border/50 bg-muted/10">
            <div className="flex items-center gap-2">
              {isValid ? (
                <span className="flex items-center gap-1 text-xs text-green-400"><Check className="h-3 w-3" />有效 JSON</span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-red-400"><AlertCircle className="h-3 w-3" />{errorMsg || "无效 JSON"}</span>
              )}
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => copy(output)} disabled={!output} title="复制 (Ctrl+Enter)"><Copy className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" onClick={download} disabled={!output} title="下载"><Download className="h-4 w-4" /></Button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="结果..."
            className="flex-1 p-4 bg-transparent outline-none font-mono text-sm resize-none"
            spellCheck={false}
          />
        </div>
      </div>

      {/* 状态栏 */}
      <div className="flex items-center justify-between px-4 py-1 border-t border-border text-xs text-muted-foreground bg-muted/10">
        <span>{input ? `${input.length} 字符` : "等待输入..."}</span>
        <span>快捷键: Ctrl+Enter 复制 | Ctrl+B 清空</span>
      </div>
    </div>
  );
}
