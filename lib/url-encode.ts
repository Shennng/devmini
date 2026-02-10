// ============================================
// URL 编码工具函数（从 app/url-encode/page.tsx 提取）
// ============================================

type UrlEncodeMode = "encode" | "decode";

interface UrlEncodeResult {
  output: string;
  isError: boolean;
}

// URL 编码
export function urlEncode(input: string, safeMode: boolean = false): string {
  if (!input.trim()) return "";
  return safeMode ? encodeURIComponent(input) : encodeURI(input);
}

// URL 解码
export function urlDecode(input: string): UrlEncodeResult {
  if (!input.trim()) return { output: "", isError: false };
  try {
    const decoded = decodeURI(input);
    return { output: decoded, isError: false };
  } catch {
    return { output: "解码失败: URL 格式错误", isError: true };
  }
}

// URL 编码/解码（统一接口）
export function urlEncodeDecode(input: string, mode: UrlEncodeMode, safeMode: boolean = false): string {
  if (mode === "encode") {
    return urlEncode(input, safeMode);
  } else {
    const result = urlDecode(input);
    return result.output;
  }
}
