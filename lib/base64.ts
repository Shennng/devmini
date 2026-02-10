// ============================================
// Base64 工具函数（从 app/base64/page.tsx 提取）
// ============================================

interface Base64Result {
  output: string;
  isValid: boolean;
}

// Base64 编码（支持 Unicode）
export function base64Encode(input: string): string {
  if (!input.trim()) return "";
  try {
    return btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_: string, p1: string) => String.fromCharCode(parseInt(p1, 16))));
  } catch {
    return "";
  }
}

// Base64 解码（支持 Unicode）
export function base64Decode(input: string): Base64Result {
  if (!input.trim()) return { output: "", isValid: true };
  try {
    const decoded = decodeURIComponent(atob(input).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return { output: decoded, isValid: true };
  } catch {
    return { output: "解码失败: 输入不是有效的 Base64 字符串", isValid: false };
  }
}
