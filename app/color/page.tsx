"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/hooks/use-toast";
import { Copy, Palette, RefreshCw } from "lucide-react";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("").toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
}

type ColorFormat = "hex" | "rgb" | "hsl";

export default function ColorPage() {
  const [input, setInput] = useState("");
  const [color, setColor] = useState<{ hex: string; rgb: string; hsl: string; raw: any } | null>(null);
  const [format, setFormat] = useState<ColorFormat>("hex");
  const { toast } = useToast();

  const parseColor = useCallback((value: string) => {
    const v = value.trim();
    if (!v) { setColor(null); return; }

    let hex = "";
    // HEX
    if (v.startsWith("#")) {
      const rgb = hexToRgb(v);
      if (rgb) hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    } else if (/^[0-9A-Fa-f]{6}$/.test(v)) {
      hex = "#" + v.toUpperCase();
    } else if (/^[0-9A-Fa-f]{3}$/.test(v)) {
      const rgb = hexToRgb("#" + v);
      if (rgb) hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    } else if (v.startsWith("rgb")) {
      const match = v.match(/(\d+),\s*(\d+),\s*(\d+)/);
      if (match) {
        const [, r, g, b] = match.map(Number);
        hex = rgbToHex(r, g, b);
      }
    } else if (v.startsWith("hsl")) {
      const match = v.match(/(\d+),\s*(\d+)%?,\s*(\d+)%?/);
      if (match) {
        const [, h, s, l] = match.map(Number);
        const rgb = hslToRgb(h, s, l);
        hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      }
    }

    if (hex) {
      const rgb = hexToRgb(hex)!;
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      setColor({
        hex,
        rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
        raw: { r: rgb.r, g: rgb.g, b: rgb.b, h: hsl.h, s: hsl.s, l: hsl.l }
      });
    } else { setColor(null); }
  }, []);

  useEffect(() => { parseColor(input); }, [input, parseColor]);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({ title: "已复制到剪贴板" });
    } catch { toast({ title: "复制失败" }); }
  };

  const clear = () => { setInput(""); };

  const sampleColors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"];

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] lg:h-[calc(100vh-3.5rem)]">
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-muted/20">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">颜色转换</span>
        </div>
        <div className="flex gap-2">
          {sampleColors.map(c => (
            <button key={c} onClick={() => setInput(c)} className="w-6 h-6 rounded border border-border" style={{ backgroundColor: c }} title={c} />
          ))}
        </div>
      </div>

      <div className="p-4 border-b border-border">
        <Label className="text-sm font-medium mb-2 block">输入颜色 (HEX / RGB / HSL)</Label>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="输入颜色值，如 #FF6B6B 或 rgb(255, 107, 107)..."
            className="flex-1 bg-background border border-border rounded-lg px-4 py-3 font-mono text-lg outline-none focus:border-primary"
          />
          <Button variant="outline" onClick={clear}>清空</Button>
        </div>
      </div>

      {color && (
        <div className="flex-1 p-4">
          <div className="flex gap-6">
            <div className="w-48 h-48 rounded-lg border border-border flex-shrink-0" style={{ backgroundColor: color.hex }} />
            <div className="flex-1 grid grid-cols-1 gap-4">
              {[
                { label: "HEX", value: color.hex },
                { label: "RGB", value: color.raw ? `${color.raw.r}, ${color.raw.g}, ${color.raw.b}` : "" },
                { label: "HSL", value: color.raw ? `${color.raw.h}, ${color.raw.s}%, ${color.raw.l}%` : "" }
              ].map(item => (
                <div key={item.label} className="border border-border rounded-lg p-4">
                  <Label className="text-xs text-muted-foreground mb-1 block">{item.label}</Label>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-lg">{item.value || "—"}</span>
                    <Button variant="ghost" size="sm" onClick={() => copy(item.value)}><Copy className="h-4 w-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!color && input && (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          无法识别的颜色格式
        </div>
      )}
    </div>
  );
}
