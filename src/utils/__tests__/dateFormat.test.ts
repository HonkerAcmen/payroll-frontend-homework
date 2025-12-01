import { formatDate, formatDateLocal } from "../dateFormat";

describe("dateFormat - formatDate", () => {
  it("当入参为空时返回 '-'", () => {
    expect(formatDate(null)).toBe("-");
    expect(formatDate(undefined)).toBe("-");
  });

  it("支持字符串和 Date 对象，格式为 yyyy-mm-dd", () => {
    const dateStr = "2025-12-01T10:20:30.000Z";
    const dateObj = new Date("2025-12-01T10:20:30.000Z");

    expect(formatDate(dateStr)).toBe("2025-12-01");
    expect(formatDate(dateObj)).toBe("2025-12-01");
  });

  it("无效日期返回 '-'", () => {
    expect(formatDate("not-a-date")).toBe("-");
  });

  it("发生异常时返回 '-'（通过构造异常对象模拟）", () => {
    const badDate = {
      // @ts-expect-error 故意模拟一个在 getTime 时抛错的对象
      getTime() {
        throw new Error("mock error");
      },
    };

    expect(formatDate(badDate as unknown as Date)).toBe("-");
  });
});

describe("dateFormat - formatDateLocal", () => {
  it("当入参为空时返回 '-'", () => {
    expect(formatDateLocal(null)).toBe("-");
    expect(formatDateLocal(undefined)).toBe("-");
  });

  it("返回本地化日期字符串", () => {
    const date = new Date("2025-12-01T00:00:00.000Z");
    const result = formatDateLocal(date);
    expect(result).toBeTruthy();
  });

  it("无效日期返回 '-'", () => {
    expect(formatDateLocal("not-a-date")).toBe("-");
  });
});
