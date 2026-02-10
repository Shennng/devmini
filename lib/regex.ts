// ============================================
// 正则表达式工具函数（简化版）
// ============================================

type Flag = "g" | "i" | "m";

export function createRegex(pattern: string, flags: Flag[] = []): RegExp | null {
  if (!pattern) return null;
  try {
    return new RegExp(pattern, flags.join(""));
  } catch {
    return null;
  }
}

export function matchRegex(text: string, pattern: string, flags: Flag[] = ["g"]): RegExpExecArray[] {
  if (!text || !pattern) return [];
  try {
    const regex = new RegExp(pattern, flags.join(""));
    const matches: RegExpExecArray[] = [];
    let match: RegExpExecArray | null;
    const globalRegex = flags.includes("g") ? regex : new RegExp(pattern, "g");
    while ((match = globalRegex.exec(text)) !== null) {
      matches.push(match);
      if (!flags.includes("g")) break;
    }
    return matches;
  } catch {
    return [];
  }
}

export function replaceRegex(text: string, pattern: string, replacement: string): string {
  if (!text || !pattern) return text;
  try {
    return text.replace(new RegExp(pattern), replacement);
  } catch {
    return text;
  }
}

export function isValidPattern(pattern: string): boolean {
  if (!pattern) return true;
  try {
    new RegExp(pattern);
    return true;
  } catch {
    return false;
  }
}
