import { useRouter } from "next/router";
import { useState } from "react";
import {
  useEmployee,
  useUpdateEmployee,
  useSalaryRecords,
  useTransferRecords,
} from "@/api/hooks";
import EmployeeForm from "@/components/EmployeeForm";
import Link from "next/link";
import { Employee } from "@/types/api";

type TabType = "info" | "salary" | "transfer";

export default function EmployeeDetailPage() {
  const { id } = useRouter().query;
  const employeeId = Number(id);
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [isEditing, setIsEditing] = useState(false);

  const { data: employee, isLoading: employeeLoading } =
    useEmployee(employeeId);
  const { data: salaryRecords, isLoading: salaryLoading } =
    useSalaryRecords(employeeId);
  const { data: transferRecords, isLoading: transferLoading } =
    useTransferRecords(employeeId);
  const update = useUpdateEmployee();

  const handleUpdate = async (formData: Partial<Employee>) => {
    if (!employee) return;
    try {
      await update.mutateAsync({ id: employee.id, ...formData });
      setIsEditing(false);
    } catch (error) {
      console.error("更新员工失败:", error);
    }
  };

  if (employeeLoading) {
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

  if (!employee) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
        <svg
          className="mx-auto mb-4 h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="text-lg text-gray-500">员工不存在</p>
        <Link
          href="/employees"
          className="mt-4 inline-block text-blue-600 hover:text-blue-700"
        >
          返回员工列表
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* 返回按钮和标题 */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/employees"
              className="inline-flex items-center font-medium text-blue-600 transition-colors hover:text-blue-700"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              返回员工列表
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">员工详情</h1>
              <p className="mt-1 text-sm text-gray-500">{employee.name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex gap-1 px-6">
            <button
              onClick={() => setActiveTab("info")}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "info"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              基本信息
            </button>
            <button
              onClick={() => setActiveTab("salary")}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "salary"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              工资记录
            </button>
            <button
              onClick={() => setActiveTab("transfer")}
              className={`border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "transfer"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              职工调动记录
            </button>
          </div>
        </div>
      </div>

      {/* 基本信息 Tab */}
      {activeTab === "info" && (
        <div>
          {isEditing ? (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <EmployeeForm
                employee={employee}
                onSubmit={handleUpdate}
                onCancel={() => setIsEditing(false)}
                isLoading={update.isPending}
              />
            </div>
          ) : (
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-start justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  基本信息
                </h2>
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 font-medium text-white shadow-md transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-lg"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  编辑
                </button>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                    ID
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {employee.id}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                    姓名
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {employee.name}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                    部门
                  </label>
                  <p className="text-lg">
                    <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm leading-5 font-semibold text-blue-800">
                      {employee.department}
                    </span>
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                    职位
                  </label>
                  <p className="text-lg font-medium text-gray-900">
                    {employee.position}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                    薪资
                  </label>
                  <p className="text-lg font-bold text-green-600">
                    ¥{employee.salary.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                    入职日期
                  </label>
                  <p className="text-lg font-medium text-gray-900">
                    {employee.hireDate}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 工资记录 Tab */}
      {activeTab === "salary" && (
        <div>
          {salaryLoading ? (
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
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {salaryRecords && salaryRecords.length > 0 ? (
                      salaryRecords.map((r) => (
                        <tr
                          key={r.id}
                          className="transition-colors hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                            {r.month}
                          </td>
                          <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                            ¥{r.baseSalary.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm whitespace-nowrap text-green-600">
                            ¥{r.bonus.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm whitespace-nowrap text-red-600">
                            ¥{r.deduction.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold whitespace-nowrap text-blue-600">
                            ¥{r.total.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
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
                          <p className="mt-2 text-sm text-gray-500">
                            暂无工资记录
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 职工调动记录 Tab */}
      {activeTab === "transfer" && (
        <div>
          {transferLoading ? (
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
                        类型
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        原部门
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        新部门
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        原职位
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        新职位
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        调动日期
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        原因
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                        备注
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {transferRecords && transferRecords.length > 0 ? (
                      transferRecords.map((r) => (
                        <tr
                          key={r.id}
                          className="transition-colors hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex rounded-full bg-purple-100 px-2 py-1 text-xs leading-5 font-semibold text-purple-800">
                              {r.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                            {r.fromDepartment || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                            {r.toDepartment || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                            {r.fromPosition || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                            {r.toPosition || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                            {r.transferDate}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {r.reason || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {r.remark || "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-6 py-12 text-center">
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
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <p className="mt-2 text-sm text-gray-500">
                            暂无调动记录
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
