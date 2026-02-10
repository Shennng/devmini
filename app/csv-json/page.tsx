"use client";
import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";
import { Copy, Download, ArrowRightLeft, FileSpreadsheet, FileJson, Trash2 } from "lucide-react";

type Mode = "csvToJson" | "jsonToCsv";

function csvToJson(csv: string): string {
  if (!csv.trim()) return "";
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return "CSV 至少需要一行表头和一行数据";
  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
  const data = lines.slice(1).map(line => {
    const values = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
    return headers.reduce((obj: Record<string, string>, header, i) => {
      obj[header] = values[i] || "";
      return obj;
    }, {});
  });
  return JSON.stringify(data, null, 2);
}

function jsonToCsv(json: string): string {
  if (!json.trim()) return "";
  try {
    const data = JSON.parse(json);
    const arr = Array.isArray(data) ? data : [data];
    if (arr.length === 0) return "JSON 解析成功但无数据";
    const headers = Object.keys(arr[0]);
    const csvLines = [headers.join(",")];
    arr.forEach(obj => {
      const values = headers.map(h => {
        const val = String(obj[h] || "");
        return val.includes(",") ? `"${val}"` : val;
      });
      csvLines.push(values.join(","));
    });
    return csvLines.join("\n");
  } catch (e) {
    return "无效 JSON 格式";
  }
}

export default function CsvJsonPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("csvToJson");
  const { toast } = useToast();

  const process = useCallback((value: string, currentMode: Mode) => {
    if (!value.trim()) { setOutput(""); return; }
    setOutput(currentMode === "csvToJson" ? csvToJson(value) : jsonToCsv(value));
  }, []);

  const handleInputChange = (value: string) => {
    setInput(value);
    process(value, mode);
  };

  const toggleMode = () => {
    const newMode = mode === "csvToJson" ? "jsonToCsv" : "csvToJson";
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
    const blob = new Blob([output], { type: mode === "csvToJson" ? "application/json" : "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = mode === "csvToJson" ? "output.json" : "output.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "文件已下载" });
  };

  const clear = () => { setInput(""); setOutput(""); toast({ title: "已清空" }); };

  const sampleCsv = `name,age,city
Alice,25,Beijing
Bob,30,Shanghai
Charlie,28,Shenzhen`;

  const sampleJson = `[
  { "name": "Alice", "age": 25, "city": "Beijing" },
  { "name": "Bob", "age": 30, "city": "Shanghai" }
]`;

  const loadSample = () => { setInput(mode === "csvToJson" ? sampleCsv : sampleJson); };

  useEffect(() => { process(input, mode); }, [mode]);

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] lg:h-[calc(100vh-3.5rem)]">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{mode === "csvToJson" ? "CSV → JSON" : "JSON → CSV"}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={loadSample}>加载示例</Button>
          <Button variant="ghost" size="sm" onClick={toggleMode}>切换方向</Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-border">
        <div className="flex flex-col p-4 gap-2">
          <Label className="text-sm font-medium flex justify-between">
            <span>{mode === "csvToJson" ? "CSV 输入" : "JSON 输入"}</span>
            <Button variant="ghost" size="sm" onClick={clear}><Trash2 className="h-4 w-4" /></Button>
          </Label>
          <textarea
            value={input}
            onChange={e => handleInputChange(e.target.value)}
            placeholder={mode === "csvToJson" ? "粘贴 CSV..." : "粘贴 JSON..."}
            className="flex-1 bg-background border border-border rounded-lg p-4 font-mono text-sm resize-none outline-none focus:border-primary"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col p-4 gap-2">
          <Label className="text-sm font-medium flex justify-between">
            <span>{mode === "csvToJson" ? "JSON 输出" : "CSV 输出"}</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => copy(output)} disabled={!output}><Copy className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm" onClick={download} disabled={!output}><Download className="h-4 w-4" /></Button>
            </div>
          </Label>
          <textarea
            value={output}
            readOnly
            placeholder="结果..."
            className={`flex-1 bg-muted/10 border border-border rounded-lg p-4 font-mono text-sm resize-none outline-none ${output.startsWith("无效") || output.startsWith("CSV") ? "text-red-400" : ""}`}
            spellCheck={false}
          />
        </div>
      </div>

      <div className="px-6 py-2 border-t border-border text-xs text-muted-foreground">
        {mode === "csvToJson" ? "CSV 要求: 第一行为表头，以逗号分隔" : "JSON 要求: 支持数组格式或单对象格式"}
      </div>
    </div>
  );
}
