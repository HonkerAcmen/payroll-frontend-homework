/**
 * CSV 导出工具函数
 */

export interface CSVExportOptions {
  filename?: string;
  headers: string[];
  rows: (string | number | null | undefined)[][];
  addBOM?: boolean; // 是否添加 BOM（用于 Excel 正确识别 UTF-8 中文）
}

/**
 * 导出 CSV 文件
 */
export function exportToCSV({
  filename = `export_${new Date().toISOString().split("T")[0]}.csv`,
  headers,
  rows,
  addBOM = true,
}: CSVExportOptions): void {
  // 转义 CSV 单元格值
  const escapeCell = (cell: string | number | null | undefined): string => {
    if (cell === null || cell === undefined) return "";
    const str = String(cell);
    // 如果包含逗号、双引号或换行符，则用双引号包裹并转义双引号
    if (/[,"\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map(escapeCell).join(",")),
  ].join("\n");

  // 添加 BOM 以便 Excel 正确识别 UTF-8 中文
  const content = addBOM ? "\uFEFF" + csvContent : csvContent;
  const blob = new Blob([content], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
