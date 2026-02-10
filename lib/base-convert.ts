// ============================================
// 进制转换工具函数（简化版）
// ============================================

type Base = 2 | 8 | 10 | 16;
const prefixes: Record<Base, string> = { 2: "0b", 8: "0o", 10: "", 16: "0x" };

export function convertBase(value: string, fromBase: Base, toBases: Base[] = [2, 8, 10, 16]): Record<Base, string> {
  if (!value.trim()) return { 2: "", 8: "", 10: "", 16: "" };
  try {
    const decimal = parseInt(value, fromBase);
    if (isNaN(decimal) || decimal < 0) throw new Error("无效");
    const result: Record<Base, string> = {} as Record<Base, string>;
    toBases.forEach(base => {
      result[base] = prefixes[base] + (base === 16 ? decimal.toString(16).toUpperCase() : decimal.toString(base));
    });
    return result;
  } catch {
    return { 2: "无效", 8: "无效", 10: "无效", 16: "无效" };
  }
}

export function decimalTo(value: number, base: Base): string {
  if (isNaN(value) || value < 0) return "无效";
  const result = base === 16 ? value.toString(16).toUpperCase() : value.toString(base);
  return prefixes[base] + result;
}
