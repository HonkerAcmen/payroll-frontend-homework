import {
  useEmployees,
  useCreateEmployee,
  useUpdateEmployee,
  useDeleteEmployee,
} from "@/api/hooks";
import { useState, useMemo } from "react";
import Link from "next/link";
import Modal from "@/components/Modal";
import EmployeeForm from "@/components/EmployeeForm";
import { Employee } from "@/types/api";

export default function EmployeePage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchName, setSearchName] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // 计算 limit 和 offset
  const limit = pageSize;
  const offset = (page - 1) * pageSize;

  const { data, isLoading } = useEmployees({
    limit: limit.toString(),
    offset: offset.toString(),
    department: filterDepartment,
  });

  const create = useCreateEmployee();
  const update = useUpdateEmployee();
  const deleteEmployee = useDeleteEmployee();

  // useEmployees 现在直接返回 Employee[]，不需要处理分页响应
  const employees = useMemo(() => {
    if (!data) return [];
    // 前端过滤姓名（后端不支持 name 参数）
    let filtered = data;
    if (searchName) {
      filtered = filtered.filter((e) => e.name.includes(searchName));
    }
    return filtered;
  }, [data, searchName]);

  // 由于后端使用 limit/offset，我们无法知道总数，这里使用当前数据长度
  const total = employees.length;
  const totalPages = Math.ceil(total / pageSize);

  // 获取所有部门用于过滤
  const departments = useMemo(() => {
    const deptSet = new Set<string>();
    if (data) {
      data.forEach((e) => e.department && deptSet.add(e.department));
    }
    return Array.from(deptSet).sort();
  }, [data]);

  const handleCreate = async (formData: Partial<Employee>) => {
    try {
      await create.mutateAsync(formData);
      setIsCreateModalOpen(false);
      setSearchName("");
    } catch (error) {
      console.error("创建员工失败:", error);
    }
  };

  const handleUpdate = async (formData: Partial<Employee>) => {
    if (!editingEmployee) return;
    try {
      await update.mutateAsync({ id: editingEmployee.id, ...formData });
      setEditingEmployee(null);
    } catch (error) {
      console.error("更新员工失败:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("确定要删除这个员工吗？")) return;
    try {
      await deleteEmployee.mutateAsync(id);
    } catch (error) {
      console.error("删除员工失败:", error);
    }
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
            <h1 className="text-2xl font-bold text-gray-800">员工管理</h1>
            <p className="mt-1 text-sm text-gray-500">管理和查看所有员工信息</p>
          </div>
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
            新增员工
          </button>
        </div>
      </div>

      {/* 搜索和过滤 */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                className="w-full rounded-lg border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="搜索员工姓名..."
                value={searchName}
                onChange={(e) => {
                  setSearchName(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
          <select
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={filterDepartment}
            onChange={(e) => {
              setFilterDepartment(e.target.value);
              setPage(1);
            }}
          >
            <option value="">全部部门</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
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
                  姓名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  部门
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  职位
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  薪资
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  入职日期
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {employees.length === 0 ? (
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
                employees.map((e) => (
                  <tr key={e.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                      {e.id}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                      {e.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs leading-5 font-semibold text-blue-800">
                        {e.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      {e.position}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold whitespace-nowrap text-green-600">
                      ¥{e.base_salary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      {e.join_date
                        ? new Date(e.join_date).toLocaleDateString("zh-CN")
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/employees/${e.id}`}
                          className="font-medium text-blue-600 hover:text-blue-900"
                        >
                          详情
                        </Link>
                        <button
                          onClick={() => setEditingEmployee(e)}
                          className="font-medium text-green-600 hover:text-green-900"
                        >
                          编辑
                        </button>
                        <button
                          onClick={() => handleDelete(e.id)}
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

      {/* 创建员工 Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="新增员工"
      >
        <EmployeeForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={create.isPending}
        />
      </Modal>

      {/* 编辑员工 Modal */}
      <Modal
        isOpen={!!editingEmployee}
        onClose={() => setEditingEmployee(null)}
        title="编辑员工"
      >
        {editingEmployee && (
          <EmployeeForm
            employee={editingEmployee}
            onSubmit={handleUpdate}
            onCancel={() => setEditingEmployee(null)}
            isLoading={update.isPending}
          />
        )}
      </Modal>
    </div>
  );
}
