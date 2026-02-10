"use client";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";
import { Copy, Download, ArrowRightLeft, Code, Trash2 } from "lucide-react";

type Mode = "yamlToJson" | "jsonToYaml";

function yamlToJson(yaml: string): string {
  if (!yaml.trim()) return "";
  const lines = yaml.split("\n");
  const result: Record<string, any> = {};
  const stack: { indent: number; obj: Record<string, any> }[] = [{ indent: -1, obj: result }];

  lines.forEach(line => {
    const trimmed = line.replace(/^(\s*)-/, (match, spaces) => {
      const indent = spaces.length;
      const key = trimmed.replace(/^(\s*)-/, "").split(":")[0].trim();
      const value = trimmed.split(":")[1]?.trim();
      const arr = stack[stack.length - 1].obj[key] || [];
      if (value) arr.push(value.startsWith("[") ? JSON.parse(value) : value);
      else arr.push({});
      stack[stack.length - 1].obj[key] = arr;
      return line;
    });
    if (!trimmed || trimmed.startsWith("#")) return;
    const indent = line.search(/\S/);
    const key = trimmed.split(":")[0].trim();
    const value = trimmed.split(":")[1]?.trim();

    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) stack.pop();

    if (value === undefined || value === "") {
      stack.push({ indent, obj: {} });
      if (key) stack[stack.length - 2].obj[key] = stack[stack.length - 1].obj;
    } else {
      let val: any = value;
      if (value === "true") val = true;
      else if (value === "false") val = false;
      else if (value === "null") val = null;
      else if (/^-?\d+$/.test(value)) val = parseInt(value);
      else if (/^-?\d+\.\d+$/.test(value)) val = parseFloat(value);
      else if (value.startsWith("[") && value.endsWith("]")) {
        try { val = JSON.parse(value.replace(/'/g, '"')); } catch { val = value; }
      }
      stack[stack.length - 1].obj[key] = val;
    }
  });

  try { return JSON.stringify(result, null, 2); }
  catch (e) { return "YAML 解析失败: " + (e as Error).message; }
}

function jsonToYaml(json: string, indent = 2): string {
  if (!json.trim()) return "";
  try {
    const obj = JSON.parse(json);
    const arr = Array.isArray(obj) ? obj : [obj];
    const spaces = " ".repeat(indent);
    const toYaml = (obj: any, depth = 0): string => {
      const currentIndent = spaces.repeat(depth);
      return Object.entries(obj).map(([k, v]) => {
        if (typeof v === "object" && v !== null && !Array.isArray(v)) {
          return `${currentIndent}${k}:\n${toYaml(v, depth + 1)}`;
        } else if (Array.isArray(v)) {
          if (v.length === 0) return `${currentIndent}${k}: []`;
          return v.map(item => {
            if (typeof item === "object" && item !== null) {
              return `${currentIndent}- ${JSON.stringify(item)}`;
            }
            return `${currentIndent}- ${item}`;
          }).join("\n");
        } else {
          const val = typeof v === "string" ? v : String(v);
          return `${currentIndent}${k}: ${val}`;
        }
      }).join("\n");
    };
    return arr.map(item => toYaml(item)).join("\n---\n");
  } catch (e) {
    return "无效 JSON 格式";
  }
}

export default function YamlJsonPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("yamlToJson");
  const { toast } = useToast();

  const process = useCallback((value: string, currentMode: Mode) => {
    if (!value.trim()) { setOutput(""); return; }
    setOutput(currentMode === "yamlToJson" ? yamlToJson(value) : jsonToYaml(value));
  }, []);

  const handleInputChange = (value: string) => {
    setInput(value);
    process(value, mode);
  };

  const toggleMode = () => {
    const newMode = mode === "yamlToJson" ? "jsonToYaml" : "yamlToJson";
    setMode(newMode);
    setInput(output);
    setOutput("");
  };

  const copy = async (text: string) => {
    if (!text) return;
    try { await navigator.clipboard.writeText(text); toast({ title: "已复制" }); }
    catch { toast({ title: "复制失败" }); }
  };

  const download = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/yaml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = mode === "yamlToJson" ? "output.yaml" : "output.yaml";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "文件已下载" });
  };

  const clear = () => { setInput(""); setOutput(""); toast({ title: "已清空" }); };

  const sampleYaml = `name: DevMini
version: 1.0.0
features:
  - JSON格式化
  - Base64编码
  - 时间戳转换
author:
  name: DevMini Team
  email: dev@example.com`;

  const sampleJson = `{
  "name": "DevMini",
  "version": "1.0.0",
  "features": ["JSON格式化", "Base64编码", "时间戳转换"],
  "author": { "name": "DevMini Team", "email": "dev@example.com" }
}`;

  const loadSample = () => { setInput(mode === "yamlToJson" ? sampleYaml : sampleJson); };

  useEffect(() => { process(input, mode); }, [mode]);

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] lg:h-[calc(100vh-3.5rem)]">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <Code className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{mode === "yamlToJson" ? "YAML → JSON" : "JSON → YAML"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={loadSample}>加载示例</Button>
          <Button variant="ghost" size="sm" onClick={toggleMode}>切换方向</Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
        <div className="flex flex-col p-4 gap-2">
          <Label className="text-sm font-medium flex justify-between">
            <span>{mode === "yamlToJson" ? "YAML 输入" : "JSON 输入"}</span>
            <Button variant="ghost" size="sm" onClick={clear}><Trash2 className="h-4 w-4" /></Button>
          </Label>
          <textarea
            value={input}
            onChange={e => handleInputChange(e.target.value)}
            placeholder={mode === "yamlToJson" ? "粘贴 YAML..." : "粘贴 JSON..."}
            className="flex-1 bg-background border border-border rounded-lg p-4 font-mono text-sm resize-none outline-none focus:border-primary"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col p-4 gap-2">
          <Label className="text-sm font-medium flex justify-between">
            <span>{mode === "yamlToJson" ? "JSON 输出" : "YAML 输出"}</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => copy(output)} disabled={!output}><Copy className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" onClick={download} disabled={!output}><Download className="h-4 w-4" /></Button>
            </div>
          </Label>
          <textarea
            value={output}
            readOnly
            placeholder="结果..."
            className={`flex-1 bg-muted/10 border border-border rounded-lg p-4 font-mono text-sm resize-none outline-none ${output.startsWith("无效") || output.startsWith("YAML") ? "text-red-400" : ""}`}
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
