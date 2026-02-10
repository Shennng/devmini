"use client";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";
import { Copy, Key, AlertCircle, CheckCircle, Clock, Shield } from "lucide-react";

interface JWTPart { header: Record<string, any>; payload: Record<string, any>; signature: string }

function decodeJWT(token: string): JWTPart | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const decode = (str: string) => JSON.parse(atob(str.replace(/-/g, "+").replace(/_/g, "/")));
    return { header: decode(parts[0]), payload: decode(parts[1]), signature: parts[2] };
  } catch { return null; }
}

function formatTimestamp(ts: number): string {
  return new Date(ts * 1000).toLocaleString("zh-CN", { hour12: false });
}

export default function JwtDecodePage() {
  const [token, setToken] = useState("");
  const [decoded, setDecoded] = useState<JWTPart | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"header" | "payload">("payload");
  const { toast } = useToast();

  const process = useCallback(() => {
    if (!token.trim()) { setDecoded(null); setError(""); return; }
    const result = decodeJWT(token.trim());
    if (result) { setDecoded(result); setError(""); }
    else { setDecoded(null); setError("无效的 JWT 格式"); }
  }, [token]);

  useEffect(() => { process(); }, [process]);

  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); toast({ title: "已复制到剪贴板" }); }
    catch { toast({ title: "复制失败" }); }
  };

  const clear = () => { setToken(""); setDecoded(null); setError(""); };

  const isExpired = decoded?.payload?.exp && decoded.payload.exp < Date.now() / 1000;

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] lg:h-[calc(100vh-3.5rem)]">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">JWT 解码</span>
        </div>
        {decoded && (
          <div className="flex items-center gap-2">
            {isExpired ? (
              <span className="flex items-center gap-1 text-xs text-red-400"><AlertCircle className="h-3 w-3" />已过期</span>
            ) : decoded.payload.exp ? (
              <span className="flex items-center gap-1 text-xs text-green-400"><Clock className="h-3 w-3" />有效</span>
            ) : null}
          </div>
        )}
      </div>

      {/* Token 输入 */}
      <div className="p-4 border-b border-border">
        <Label className="text-sm font-medium mb-2 block">JWT Token</Label>
        <div className="flex gap-2">
          <textarea
            value={token}
            onChange={e => setToken(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            className="flex-1 bg-background border border-border rounded-lg px-4 py-3 font-mono text-sm resize-none h-24 outline-none focus:border-primary"
          />
          <div className="flex flex-col gap-2">
            <Button variant="outline" onClick={clear}>清空</Button>
          </div>
        </div>
        {error && <div className="mt-2 text-red-400 text-sm">{error}</div>}
      </div>

      {/* 解码结果 */}
      {decoded && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab 切换 */}
          <div className="flex border-b border-border">
            {["payload", "header"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as typeof activeTab)} className={`px-4 py-2 text-sm ${activeTab === tab ? "border-b-2 border-primary font-medium" : "text-muted-foreground"}`}>
                {tab === "payload" ? "Payload" : "Header"}
              </button>
            ))}
          </div>

          {/* 内容区 */}
          <div className="flex-1 p-4 overflow-auto">
            <div className="flex justify-end mb-2">
              <Button variant="ghost" size="sm" onClick={() => copy(JSON.stringify(decoded[activeTab], null, 2))}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <pre className="font-mono text-sm bg-muted/20 p-4 rounded-lg overflow-auto">
              {JSON.stringify(decoded[activeTab], null, 2)}
            </pre>
          </div>

          {/* 过期时间提示 */}
          {decoded.payload.exp && (
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">过期时间:</span>
                <span className="font-mono">{formatTimestamp(decoded.payload.exp)}</span>
                {isExpired ? <span className="text-red-400">⛔ 已过期</span> : <span className="text-green-400">✅ 有效</span>}
              </div>
            </div>
          )}
        </div>
      )}

      {!decoded && !error && (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          输入 JWT Token 自动解码
        </div>
      )}
    </div>
  );
}
