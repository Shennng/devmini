"use client";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";
import { Copy, Lock, FileKey, RefreshCw } from "lucide-react";

type Algorithm = "MD5" | "SHA256" | "SHA512" | "SHA1";

async function hashMessage(algorithm: Algorithm, message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest(algorithm.replace("SHA", "SHA-"), msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function HashPage() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [algorithm, setAlgorithm] = useState<Algorithm>("MD5");
  const { toast } = useToast();

  const calculate = useCallback(async () => {
    if (!input.trim()) { setHashes({}); return; }
    const result = await hashMessage(algorithm, input);
    setHashes({ [algorithm]: result });
  }, [input, algorithm]);

  useEffect(() => { calculate(); }, [calculate]);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({ title: "已复制到剪贴板" });
    } catch { toast({ title: "复制失败" }); }
  };

  const clear = () => {
    setInput("");
    setHashes({});
    toast({ title: "已清空" });
  };

  const paste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text);
      toast({ title: "已粘贴" });
    } catch { toast({ title: "粘贴失败" }); }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "Enter") { e.preventDefault(); calculate(); }
        else if (e.key === "b") { e.preventDefault(); clear(); }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [calculate]);

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] lg:h-[calc(100vh-3.5rem)]">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">哈希生成</span>
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs">算法:</Label>
          <select value={algorithm} onChange={e => setAlgorithm(e.target.value as Algorithm)} className="bg-background border border-border rounded px-2 py-1 text-xs">
            <option value="MD5">MD5</option>
            <option value="SHA1">SHA-1</option>
            <option value="SHA256">SHA-256</option>
            <option value="SHA512">SHA-512</option>
          </select>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
        <div className="flex flex-col p-4 gap-2">
          <Label className="text-sm font-medium flex justify-between">
            <span>输入文本</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={paste}>粘贴</Button>
              <Button variant="ghost" size="sm" onClick={clear}>清空</Button>
            </div>
          </Label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="输入要哈希的文本..."
            className="flex-1 bg-background border border-border rounded-lg p-4 font-mono text-sm resize-none outline-none focus:border-primary"
          />
        </div>

        <div className="flex flex-col p-4 gap-2">
          <Label className="text-sm font-medium flex justify-between">
            <span>哈希结果 ({algorithm})</span>
            {hashes[algorithm] && (
              <Button variant="ghost" size="sm" onClick={() => copy(hashes[algorithm])}>
                <Copy className="h-4 w-4 mr-1" />复制
              </Button>
            )}
          </Label>
          <div className="flex-1 bg-muted/10 border border-border rounded-lg p-4 overflow-auto">
            {hashes[algorithm] ? (
              <div className="break-all font-mono text-sm select-all">{hashes[algorithm]}</div>
            ) : (
              <span className="text-muted-foreground text-sm">输入文本后自动计算...</span>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-2 border-t border-border text-xs text-muted-foreground">
        快捷键: Ctrl+Enter 计算 | Ctrl+B 清空 | 结果自动复制
      </div>
    </div>
  );
}
