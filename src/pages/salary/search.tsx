import { useState, useMemo } from "react";
import { useSearchSalaries } from "@/api/hooks";
import { SalaryRecordWithCalc } from "@/types/api";
import { Table, Input, Button, Space, Spin } from "antd";
import Link from "next/link";
import { AiOutlineDownload } from "react-icons/ai";

export default function SalarySearchPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchName, setSearchName] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");

  const { data, isLoading } = useSearchSalaries({
    department: filterDepartment || "",
    month: filterMonth || "",
    year: filterYear,
  });

  const salaries = useMemo(() => data || [], [data]);
  const total = salaries.length;

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
      s.salary.bonus || 0,
      s.salary.deduction || 0,
      s.salary.net,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `工资筛选结果_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.click();
  };

  const columns = [
    { title: "ID", dataIndex: ["salary", "id"], key: "id" },
    {
      title: "员工ID",
      dataIndex: ["salary", "employee_id"],
      key: "employee_id",
    },
    {
      title: "员工姓名",
      dataIndex: ["salary", "employee", "name"],
      key: "name",
      render: (val: string) => val || "-",
    },
    {
      title: "部门",
      dataIndex: ["salary", "employee", "department"],
      key: "department",
      render: (val: string) => val || "-",
    },
    { title: "月份", dataIndex: ["salary", "month"], key: "month" },
    {
      title: "基本工资",
      dataIndex: ["salary", "base_salary"],
      key: "base_salary",
      render: (val: number) => `¥${val.toLocaleString()}`,
    },
    {
      title: "奖金",
      dataIndex: ["salary", "bonus"],
      key: "bonus",
      render: (val: number) => `¥${(val || 0).toLocaleString()}`,
    },
    {
      title: "扣款",
      dataIndex: ["salary", "deduction"],
      key: "deduction",
      render: (val: number) => `¥${(val || 0).toLocaleString()}`,
    },
    {
      title: "合计",
      dataIndex: ["salary", "net"],
      key: "net",
      render: (val: number) => (
        <span className="font-bold text-blue-600">¥{val.toLocaleString()}</span>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: SalaryRecordWithCalc) => (
        <Link
          href={`/employees/${record.salary.employee_id}`}
          className="text-blue-600 hover:underline"
        >
          查看详情
        </Link>
      ),
    },
  ];

  return (
    <div className="">
      {/* 页面标题和导出按钮 */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4 px-4 py-6 border border-gray-200 rounded-lg">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">跨员工工资筛选</h1>
          <p className="text-gray-500 mt-1">按多条件筛选和查询工资记录</p>
        </div>
        <Button
          type="primary"
          icon={<AiOutlineDownload />}
          onClick={handleExportCSV}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        >
          导出 CSV
        </Button>
      </div>

      {/* 筛选条件 */}
      <Space wrap className="mb-6">
        <Input
          placeholder="搜索姓名"
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            setPage(1);
          }}
          className="w-52"
        />
        <Input
          placeholder="搜索部门"
          value={filterDepartment}
          onChange={(e) => {
            setFilterDepartment(e.target.value);
            setPage(1);
          }}
          className="w-52"
        />
        <Input
          placeholder="月份 YYYY-MM"
          value={filterMonth}
          onChange={(e) => {
            setFilterMonth(e.target.value);
            setPage(1);
          }}
          className="w-52"
        />
        <Input
          placeholder="年份 YYYY"
          value={filterYear}
          onChange={(e) => {
            setFilterYear(e.target.value);
            setPage(1);
          }}
          className="w-52"
        />
      </Space>

      {/* 表格 */}
      {isLoading ? (
        <div className="text-center py-12">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          rowKey={(record: SalaryRecordWithCalc) => record.salary.id}
          columns={columns}
          dataSource={salaries.slice((page - 1) * pageSize, page * pageSize)}
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: (p) => setPage(p),
            showSizeChanger: false,
          }}
          className="shadow rounded-lg overflow-hidden"
        />
      )}
    </div>
  );
}
