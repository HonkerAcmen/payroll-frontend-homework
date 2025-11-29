import { useState, useMemo } from "react";
import { useSearchSalaries } from "@/api/hooks";
import Link from "next/link";
import { SalaryRecordWithCalc } from "@/types/api";

export default function SalarySearchPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchName, setSearchName] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setfilterYear] = useState("");

  const { data, isLoading } = useSearchSalaries({
    department: filterDepartment || "",
    month: filterMonth || "",
    year: filterYear,
  });

  // 处理分页数据
  const salaries = useMemo(() => {
    if (!data) return [];
    return data;
  }, [data]);

  const total = useMemo(() => {
    if (!data) return 0;
    return data.length;
  }, [data]);

  const totalPages = Math.ceil(total / pageSize);

  const handleExportCSV = () => {
    if (!salaries.length) {
      alert("没有数据可导出");
      return;
    }

    const headers = [
      "ID",
      "员工ID",
      "员工姓名",
      "部门",
      "月份",
      "基本工资",
      "奖金",
      "扣款",
      "合计",
    ];
    const rows = salaries.map((s: SalaryRecordWithCalc) => [
      s.salary.id,
      s.salary.employee_id,
      s.salary.employee.name || "",
      s.salary.employee.department || "",
      s.salary.month,
      s.salary.base_salary,
      s.salary.sick_leave_deduction,
      s.salary.net,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `工资筛选结果_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      {/* 页面标题 */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">跨员工工资筛选</h1>
            <p className="mt-1 text-sm text-gray-500">
              按多条件筛选和查询工资记录
            </p>
          </div>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 font-medium text-white shadow-md transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            导出CSV
          </button>
        </div>
      </div>

      {/* 过滤条件 */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-800">筛选条件</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              姓名
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="搜索姓名"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              部门
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="搜索部门"
              value={filterDepartment}
              onChange={(e) => {
                setFilterDepartment(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              月份
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="YYYY-MM"
              value={filterMonth}
              onChange={(e) => {
                setFilterMonth(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {/* 表格 */}
      {isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
          <svg
            className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-500">加载中...</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    员工ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    员工姓名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    部门
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    月份
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    基本工资
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    奖金
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    扣款
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    合计
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {salaries.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">暂无数据</p>
                    </td>
                  </tr>
                ) : (
                  salaries.map((s: SalaryRecordWithCalc) => (
                    <tr
                      key={s.salary.id}
                      className="transition-colors hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                        {s.salary.id}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                        {s.salary.employee_id}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                        {s.salary.employee.name || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {s.salary.employee.department ? (
                          <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs leading-5 font-semibold text-blue-800">
                            {s.salary.employee.department}
                          </span>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                        {s.salary.month}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                        ¥{s.salary.base_salary.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold whitespace-nowrap text-blue-600">
                        ¥{s.salary.net?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                        <Link
                          href={`/employees/${s.salary.employee_id}`}
                          className="font-medium text-blue-600 hover:text-blue-900"
                        >
                          查看详情
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div className="text-sm text-gray-700">
                显示{" "}
                <span className="font-medium">{(page - 1) * pageSize + 1}</span>{" "}
                到{" "}
                <span className="font-medium">
                  {Math.min(page * pageSize, total)}
                </span>{" "}
                条，共 <span className="font-medium">{total}</span> 条
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
                >
                  上一页
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
                >
                  下一页
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
