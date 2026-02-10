"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";
import { Copy, ArrowRightLeft, Download, Trash2, FileType, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";

type Mode = "encode" | "decode";

export default function Base64Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("encode");
  const [isValid, setIsValid] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // 修复 Unicode 问题的编码/解码函数
  const safeEncode = (str: string): string => {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_: string, p1: string) => String.fromCharCode(parseInt(p1, 16))));
  };

  const safeDecode = (str: string): string => {
    try {
      return decodeURIComponent(atob(str).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    } catch {
      return "";
    }
  };

  const process = useCallback((value: string, currentMode: Mode) => {
    if (!value.trim()) {
      setOutput("");
      setIsValid(true);
      return;
    }
    setIsProcessing(true);
    try {
      if (currentMode === "encode") {
        setOutput(safeEncode(value));
        setIsValid(true);
      } else {
        const decoded = safeDecode(value);
        if (decoded) {
          setOutput(decoded);
          setIsValid(true);
        } else {
          setOutput("解码失败: 输入不是有效的 Base64 字符串");
          setIsValid(false);
        }
      }
    } catch (e) {
      setOutput("解码失败: 输入不是有效的 Base64 字符串");
      setIsValid(false);
    }
    setIsProcessing(false);
  }, []);

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
    } catch { toast({ title: "复制失败", description: "请手动选择复制" }); }
  };

  const download = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = mode === "encode" ? "encoded.txt" : "decoded.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "文件已下载" });
  };

  const paste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      process(text, mode);
      toast({ title: "已粘贴" });
    } catch { toast({ title: "粘贴失败", description: "请手动粘贴" }); }
  };

  const clear = () => {
    setInput("");
    setOutput("");
    setIsValid(true);
    inputRef.current?.focus();
    toast({ title: "已清空" });
  };

  const sampleEncode = () => {
    setInput("Hello DevMini! 你好，开发者！🎉");
  };

  const sampleDecode = () => {
    setInput("SGVsbG8gRGV2TWluaQ==");
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
  }, [output]);

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] lg:h-[calc(100vh-3.5rem)]">
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Base64 {mode === "encode" ? "编码" : "解码"}</span>
          {!isValid && <span className="flex items-center gap-1 text-xs text-red-400"><AlertCircle className="h-3 w-3" />无效</span>}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={sampleEncode} title="示例"><FileType className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={clear} title="清空 (Ctrl+B)"><Trash2 className="h-4 w-4" /></Button>
          <Button variant="ghost" size="sm" onClick={toggleMode} title="切换方向"><RefreshCw className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
        {/* 输入区 */}
        <div className="flex flex-col min-h-0">
          <div className="flex items-center justify-between px-4 py-1 border-b border-border/50 bg-muted/10">
            <span className="text-xs font-medium text-muted-foreground">{mode === "encode" ? "原文" : "Base64 输入"}</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={paste} className="h-5 text-xs">粘贴</Button>
              <Button variant="ghost" size="sm" onClick={clear} className="h-5 text-xs">清空</Button>
            </div>
          </div>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => handleInputChange(e.target.value)}
            placeholder={mode === "encode" ? "输入要编码的文本..." : "输入 Base64 字符串..."}
            className="flex-1 p-4 bg-transparent outline-none font-mono text-sm resize-none"
            spellCheck={false}
          />
        </div>

        {/* 输出区 */}
        <div className="flex flex-col min-h-0">
          <div className="flex items-center justify-between px-4 py-1 border-b border-border/50 bg-muted/10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">{mode === "encode" ? "Base64 结果" : "解码结果"}</span>
              {output && isValid && <span className="flex items-center gap-1 text-xs text-green-400"><CheckCircle className="h-3 w-3" />有效</span>}
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => copy(output)} disabled={!output} title="复制 (Ctrl+Enter)"><Copy className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" onClick={download} disabled={!output} title="下载"><Download className="h-4 w-4" /></Button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder={isProcessing ? "处理中..." : "结果..."}
            className={`flex-1 p-4 bg-transparent outline-none font-mono text-sm resize-none ${!isValid ? "text-red-400" : ""}`}
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
