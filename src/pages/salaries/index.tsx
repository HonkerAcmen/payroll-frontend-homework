import { useState, useMemo } from "react";
import { useSalaries, useCreateSalary, useUpdateSalary, useDeleteSalary, useEmployees } from "@/api/hooks";
import Modal from "@/components/Modal";
import SalaryForm from "@/components/SalaryForm";
import { SalaryRecord, SalaryRecordWithCalc } from "@/types/api";

export default function SalariesPage() {
  const [filterYear, setFilterYear] = useState<number | undefined>(new Date().getFullYear());
  const [filterMonth, setFilterMonth] = useState<number | undefined>(new Date().getMonth() + 1);
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

    const headers = ["ID", "员工ID", "年份", "月份", "基本工资", "应发", "实发"];
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

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    const monthStr = filterYear && filterMonth ? `${filterYear}-${String(filterMonth).padStart(2, '0')}` : "全部";
    link.setAttribute("download", `工资记录_${monthStr}_${new Date().toISOString().split("T")[0]}.csv`);
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
            className="animate-spin h-8 w-8 text-blue-500 mb-4"
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">工资管理</h1>
            <p className="text-sm text-gray-500 mt-1">管理和查看所有工资记录</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 shadow-md hover:shadow-lg transition-all"
            >
              <svg
                className="w-5 h-5 mr-2"
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
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <svg
                className="w-5 h-5 mr-2"
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">年份</label>
            <input
              type="number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="年份"
              value={filterYear || ""}
              onChange={(e) => {
                setFilterYear(e.target.value ? Number(e.target.value) : undefined);
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">月份</label>
            <input
              type="number"
              min="1"
              max="12"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="月份 (1-12)"
              value={filterMonth || ""}
              onChange={(e) => {
                setFilterMonth(e.target.value ? Number(e.target.value) : undefined);
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">部门</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              value={filterDepartment}
              onChange={(e) => {
                setFilterDepartment(e.target.value);
              }}
            >
              <option value="">全部部门</option>
              {Array.from(new Set(employeeList.map((emp) => emp.department))).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 表格 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">员工ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">年月</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">基本工资</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">应发</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">实发</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
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
                  <tr key={s.salary.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.salary.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{s.salary.employee_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {s.salary.year}-{String(s.salary.month).padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">¥{s.salary.base_salary.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">¥{s.gross.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-600">¥{s.net.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingSalary(s.salary)}
                          className="text-green-600 hover:text-green-900 font-medium"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDelete(s.salary.id)}
                          className="text-red-600 hover:text-red-900 font-medium"
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
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
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

