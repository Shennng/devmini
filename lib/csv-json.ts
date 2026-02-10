// ============================================
// CSV/JSON 转换工具函数（简化版）
// ============================================

export function csvToJson(csv: string): string {
  if (!csv.trim()) return "";
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return "错误: 需要表头和数据";
  const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
  const data = lines.slice(1).map(line => {
    const values = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
    return headers.reduce((obj: Record<string, string>, h, i) => { obj[h] = values[i] || ""; return obj; }, {});
  });
  return JSON.stringify(data, null, 2);
}

export function jsonToCsv(json: string): string {
  if (!json.trim()) return "";
  try {
    const data = JSON.parse(json);
    const arr = Array.isArray(data) ? data : [data];
    if (arr.length === 0) return "错误: 无数据";
    const headers = Object.keys(arr[0]);
    const lines = [headers.join(",")];
    arr.forEach(obj => {
      lines.push(headers.map(h => {
        const v = String(obj[h] || "");
        return v.includes(",") ? `"${v}"` : v;
      }).join(","));
    });
    return lines.join("\n");
  } catch {
    return "错误: 无效JSON";
  }
}
