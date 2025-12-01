import { exportToCSV } from "../csvExport";

describe("csvExport - exportToCSV", () => {
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;
  const originalAppendChild = document.body.appendChild;
  const originalRemoveChild = document.body.removeChild;

  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => "blob:mock") as unknown as typeof URL.createObjectURL;
    URL.revokeObjectURL = vi.fn() as unknown as typeof URL.revokeObjectURL;
    document.body.appendChild = vi.fn() as unknown as typeof document.body.appendChild;
    document.body.removeChild = vi.fn() as unknown as typeof document.body.removeChild;
  });

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    document.body.appendChild = originalAppendChild;
    document.body.removeChild = originalRemoveChild;
  });

  it("生成 CSV 内容并触发下载（包含 BOM）", () => {
    const clickSpy = vi.fn();
    vi.spyOn(document, "createElement").mockImplementation(() => {
      return {
        setAttribute: vi.fn(),
        click: clickSpy,
      } as unknown as HTMLAnchorElement;
    });

    exportToCSV({
      filename: "test.csv",
      headers: ["列1", "列2"],
      rows: [
        ["正常", "值"],
        ['包含,逗号', '含"引号"'],
        [null, undefined],
      ],
      addBOM: true,
    });

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    expect(document.body.appendChild).toHaveBeenCalledTimes(1);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(document.body.removeChild).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1);
  });

  it("不添加 BOM 时仍然正常执行", () => {
    vi.spyOn(document, "createElement").mockImplementation(() => {
      return {
        setAttribute: vi.fn(),
        click: vi.fn(),
      } as unknown as HTMLAnchorElement;
    });

    exportToCSV({
      headers: ["h1"],
      rows: [["v1"]],
      addBOM: false,
    });

    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
  });
});


