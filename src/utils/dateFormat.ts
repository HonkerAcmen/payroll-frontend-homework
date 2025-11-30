/**
 * 日期格式化工具函数
 */

/**
 * 将日期字符串格式化为 yyyy-mm-dd 格式
 * @param dateString ISO 日期字符串或日期对象
 * @returns 格式化后的日期字符串 (yyyy-mm-dd) 或 "-"
 */
export function formatDate(
  dateString: string | Date | null | undefined
): string {
  if (!dateString) return "-";

  try {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    if (isNaN(date.getTime())) return "-";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("日期格式化错误:", error);
    return "-";
  }
}

/**
 * 将日期字符串格式化为本地化日期格式
 * @param dateString ISO 日期字符串或日期对象
 * @returns 格式化后的日期字符串
 */
export function formatDateLocal(
  dateString: string | Date | null | undefined
): string {
  if (!dateString) return "-";

  try {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    if (isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("zh-CN");
  } catch (error) {
    console.error("日期格式化错误:", error);
    return "-";
  }
}
