// ============================================
// JSON 格式化工具函数（从 app/json-format/page.tsx 提取）
// ============================================

type IndentOption = 2 | 4 | "tab";

interface JsonFormatResult {
  output: string;
  isValid: boolean;
  error?: string;
}

// 格式化 JSON
export function formatJSON(input: string, indent: IndentOption = 2): JsonFormatResult {
  if (!input.trim()) {
    return { output: "", isValid: true };
  }

  try {
    const parsed = JSON.parse(input);
    const indentStr = indent === "tab" ? "\t" : " ".repeat(indent);
    return { output: JSON.stringify(parsed, null, indentStr), isValid: true };
  } catch (e) {
    return { output: "", isValid: false, error: (e as Error).message };
  }
}

// 压缩 JSON
export function minifyJSON(input: string): JsonFormatResult {
  if (!input.trim()) {
    return { output: "", isValid: true };
  }

  try {
    const parsed = JSON.parse(input);
    return { output: JSON.stringify(parsed), isValid: true };
  } catch (e) {
    return { output: "", isValid: false, error: (e as Error).message };
  }
}

// 统一接口
export function processJSON(input: string, mode: "format" | "minify", indent: IndentOption = 2): JsonFormatResult {
  if (mode === "format") {
    return formatJSON(input, indent);
  } else {
    return minifyJSON(input);
  }
}

// 检查 JSON 是否有效
export function isValidJSON(input: string): boolean {
  try {
    JSON.parse(input);
    return true;
  } catch {
    return false;
  }
}
