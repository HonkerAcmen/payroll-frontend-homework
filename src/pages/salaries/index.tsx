import { useState, useMemo } from "react";
import {
  useSalaries,
  useCreateSalary,
  useUpdateSalary,
  useDeleteSalary,
  useEmployees,
} from "@/api/hooks";
import Modal from "@/components/Modal";
import SalaryForm from "@/components/SalaryForm";
import { SalaryRecord, SalaryRecordWithCalc } from "@/types/api";

export default function SalariesPage() {
  const [filterYear, setFilterYear] = useState<number | undefined>(
    new Date().getFullYear(),
  );
  const [filterMonth, setFilterMonth] = useState<number | undefined>(
    new Date().getMonth() + 1,
  );
  const [filterDepartment, setFilterDepartment] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingSalary, setEditingSalary] = useState<SalaryRecord | null>(null);

  const { data: employees } = useEmployees();
  const { data, isLoading } = useSalaries({
    year: filterYear,
    month: filterMonth,
    department: filterDepartment || undefined,
  });

  const create = useCreateSalary();
  const update = useUpdateSalary();
  const deleteSalary = useDeleteSalary();

  // useSalaries 返回 SalaryRecordWithCalc[]
  const salaries = useMemo(() => {
    if (!data) return [];
    return data;
  }, [data]);

  // 获取员工列表用于部门筛选
  const employeeList = useMemo(() => {
    if (!employees) return [];
    return employees;
  }, [employees]);

  const handleCreate = async (formData: Partial<SalaryRecord>) => {
    try {
      await create.mutateAsync(formData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("创建工资记录失败:", error);
    }
  };

  const handleUpdate = async (formData: Partial<SalaryRecord>) => {
    if (!editingSalary) return;
    try {
      await update.mutateAsync({ id: editingSalary.id, ...formData });
      setEditingSalary(null);
    } catch (error) {
      console.error("更新工资记录失败:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除这条工资记录吗？")) return;
    try {
      await deleteSalary.mutateAsync(id);
    } catch (error) {
      console.error("删除工资记录失败:", error);
    }
  };

  const handleExportCSV = () => {
    if (!salaries.length) {
      alert("没有数据可导出");
      return;
    }

    const headers = [
      "ID",
      "员工ID",
      "年份",
      "月份",
      "基本工资",
      "应发",
      "实发",
    ];
    const rows = salaries.map((s) => [
      s.salary.id,
      s.salary.employee_id,
      s.salary.year,
      s.salary.month,
      s.salary.base_salary,
      s.gross,
      s.net,
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
    const monthStr =
      filterYear && filterMonth
        ? `${filterYear}-${String(filterMonth).padStart(2, "0")}`
        : "全部";
    link.setAttribute(
      "download",
      `工资记录_${monthStr}_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center">
          <svg
            className="mb-4 h-8 w-8 animate-spin text-blue-500"
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
      </div>
    );
  }

  return (
    <div>
      {/* 页面标题和操作栏 */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">工资管理</h1>
            <p className="mt-1 text-sm text-gray-500">管理和查看所有工资记录</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center rounded-lg bg-gray-600 px-4 py-2 font-medium text-white shadow-md transition-all hover:bg-gray-700 hover:shadow-lg"
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
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex transform items-center rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 font-medium text-white shadow-md transition-all hover:-translate-y-0.5 hover:from-green-600 hover:to-green-700 hover:shadow-lg"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              新增工资记录
            </button>
          </div>
        </div>
      </div>

      {/* 过滤 */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              年份
            </label>
            <input
              type="number"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="年份"
              value={filterYear || ""}
              onChange={(e) => {
                setFilterYear(
                  e.target.value ? Number(e.target.value) : undefined,
                );
              }}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              月份
            </label>
            <input
              type="number"
              min="1"
              max="12"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="月份 (1-12)"
              value={filterMonth || ""}
              onChange={(e) => {
                setFilterMonth(
                  e.target.value ? Number(e.target.value) : undefined,
                );
              }}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              部门
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={filterDepartment}
              onChange={(e) => {
                setFilterDepartment(e.target.value);
              }}
            >
              <option value="">全部部门</option>
              {Array.from(
                new Set(employeeList.map((emp) => emp.department)),
              ).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 表格 */}
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
                  年月
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  基本工资
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  应发
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  实发
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {salaries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
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
                      {s.salary.year}-{String(s.salary.month).padStart(2, "0")}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                      ¥{s.salary.base_salary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold whitespace-nowrap text-green-600">
                      ¥{s.gross.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold whitespace-nowrap text-blue-600">
                      ¥{s.net.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingSalary(s.salary)}
                          className="font-medium text-green-600 hover:text-green-900"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDelete(s.salary.id)}
                          className="font-medium text-red-600 hover:text-red-900"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 统计信息 */}
        {salaries.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="text-sm text-gray-700">
              共 <span className="font-medium">{salaries.length}</span> 条记录
            </div>
          </div>
        )}
      </div>

      {/* 创建工资记录 Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="新增工资记录"
      >
        <SalaryForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={create.isPending}
        />
      </Modal>

      {/* 编辑工资记录 Modal */}
      <Modal
        isOpen={!!editingSalary}
        onClose={() => setEditingSalary(null)}
        title="编辑工资记录"
      >
        {editingSalary && (
          <SalaryForm
            salary={editingSalary}
            onSubmit={handleUpdate}
            onCancel={() => setEditingSalary(null)}
            isLoading={update.isPending}
          />
        )}
      </Modal>
    </div>
  );
}
