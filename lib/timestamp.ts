// ============================================
// 时间戳工具函数（从 app/timestamp/page.tsx 提取）
// ============================================

type FormatOption = "default" | "dateOnly" | "timeOnly" | "iso" | "chinese" | "utc" | "unix";

interface FormatInfo {
  label: string;
  options: Intl.DateTimeFormatOptions;
}

export const formats: Record<FormatOption, FormatInfo> = {
  default: { label: "默认", options: { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" } },
  dateOnly: { label: "仅日期", options: { year: "numeric", month: "2-digit", day: "2-digit" } },
  timeOnly: { label: "仅时间", options: { hour: "2-digit", minute: "2-digit", second: "2-digit" } },
  iso: { label: "ISO 24h", options: { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false } },
  chinese: { label: "中文格式", options: { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false } },
  utc: { label: "UTC", options: { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "UTC" } },
  unix: { label: "Unix 毫秒", options: { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false } }
};

// 时间戳转日期时间字符串
export function timestampToDateTime(ts: number | string, format: FormatOption = "default"): { dateTime: string; isValid: boolean } {
  try {
    if (typeof ts === 'string') {
      if (!ts.trim()) return { dateTime: "", isValid: true }
      const tsNum = parseInt(ts)
      if (isNaN(tsNum) || tsNum < 0) {
        return { dateTime: "", isValid: false }
      }
      const ms = tsNum * (format === "unix" ? 1 : 1000)
      const dateTime = new Date(ms).toLocaleString("zh-CN", formats[format]?.options || formats.default.options)
      return { dateTime, isValid: true }
    }
    const ms = ts * (format === "unix" ? 1 : 1000)
    const dateTime = new Date(ms).toLocaleString("zh-CN", formats[format]?.options || formats.default.options)
    return { dateTime, isValid: true }
  } catch {
    return { dateTime: "", isValid: false }
  }
}

// 日期时间字符串转时间戳
export function dateTimeToTimestamp(dt: string): { timestamp: string; isValid: boolean } {
  try {
    const date = new Date(dt);
    if (isNaN(date.getTime())) {
      return { timestamp: "", isValid: false };
    }
    const ts = Math.floor(date.getTime() / 1000);
    return { timestamp: ts.toString(), isValid: true };
  } catch {
    return { timestamp: "", isValid: false };
  }
}

// 获取当前时间戳
export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}
