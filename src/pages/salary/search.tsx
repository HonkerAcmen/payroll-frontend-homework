import { useState, useMemo } from "react";
import { useSearchSalaries, useEmployees } from "@/api/hooks";
import { SalaryRecordWithCalc, Employee } from "@/types/api";
import { Table, Input, Button, Space, Spin, message } from "antd";
import Link from "next/link";
import { AiOutlineDownload } from "react-icons/ai";
import { exportToCSV } from "@/utils/csvExport";

import { DEFAULT_PAGE_SIZE } from "@/constants";

export default function SalarySearchPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(DEFAULT_PAGE_SIZE);
  const [searchName, setSearchName] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");

  const { data, isLoading } = useSearchSalaries({
    department: filterDepartment || "",
    month: filterMonth || "",
    year: filterYear || "",
  });

  const { data: employees } = useEmployees();
  const employeeList = useMemo(() => employees || [], [employees]);

  // 补充 Employee 信息到工资记录中
  const salaries = useMemo(() => {
    if (!data) return [];
    return data.map((item: SalaryRecordWithCalc) => {
      // 如果 salary 中已经有 Employee 信息，直接返回
      if (item.salary.Employee) {
        return item;
      }
      // 否则从 employeeList 中查找对应的 Employee
      const employee = employeeList.find(
        (emp: Employee) => emp.id === item.salary.employee_id
      );
      if (employee) {
        return {
          ...item,
          salary: {
            ...item.salary,
            Employee: employee,
          },
        };
      }
      return item;
    });
  }, [data, employeeList]);

  // 根据姓名筛选
  const filteredSalaries = useMemo(() => {
    if (!searchName) return salaries;
    return salaries.filter((s: SalaryRecordWithCalc) =>
      s.salary.Employee?.name?.toLowerCase().includes(searchName.toLowerCase())
    );
  }, [salaries, searchName]);

  const total = filteredSalaries.length;

  /** 导出 CSV */
  const handleExportCSV = () => {
    if (!filteredSalaries.length) {
      message.warning("没有数据可导出");
      return;
    }

    exportToCSV({
      filename: `工资筛选结果_${new Date().toISOString().split("T")[0]}.csv`,
      headers: [
        "ID",
        "员工ID",
        "姓名",
        "部门",
        "年份",
        "月份",
        "基本工资",
        "工龄工资",
        "职务津贴",
        "交通补贴",
        "餐补",
        "住房补贴",
        "病事假扣款",
        "个税",
        "公积金",
        "养老保险",
        "医疗保险",
        "失业保险",
        "应发工资(gross)",
        "实发工资(net)",
      ],
      rows: filteredSalaries.map((s: SalaryRecordWithCalc) => [
        s.salary.id,
        s.salary.employee_id,
        s.salary.Employee?.name ?? "",
        s.salary.Employee?.department ?? "",
        s.salary.year,
        s.salary.month,
        s.salary.base_salary,
        s.salary.work_age_salary,
        s.salary.position_allowance,
        s.salary.transport_allowance,
        s.salary.meal_allowance,
        s.salary.housing_allowance,
        s.salary.sick_leave_deduction,
        s.salary.income_tax,
        s.salary.housing_fund,
        s.salary.pension,
        s.salary.medical_insurance,
        s.salary.unemployment,
        s.gross ?? s.salary.gross ?? "",
        s.net ?? s.salary.net ?? "",
      ]),
    });
  };

  /** 表格列 */
  const columns = [
    { title: "ID", dataIndex: ["salary", "id"], key: "id" },

    { title: "员工ID", dataIndex: ["salary", "employee_id"], key: "eid" },

    {
      title: "姓名",
      key: "name",
      render: (_: any, rec: SalaryRecordWithCalc) =>
        rec.salary.Employee?.name ?? "-",
    },
    {
      title: "部门",
      key: "department",
      render: (_: any, rec: SalaryRecordWithCalc) =>
        rec.salary.Employee?.department ?? "-",
    },

    { title: "年份", dataIndex: ["salary", "year"], key: "year" },
    { title: "月份", dataIndex: ["salary", "month"], key: "month" },

    {
      title: "基本工资",
      dataIndex: ["salary", "base_salary"],
      key: "base_salary",
      render: (v: number) => `¥${v.toLocaleString()}`,
    },
    {
      title: "工龄工资",
      dataIndex: ["salary", "work_age_salary"],
      key: "work_age_salary",
      render: (v: number) => `¥${v.toLocaleString()}`,
    },
    {
      title: "职务津贴",
      dataIndex: ["salary", "position_allowance"],
      key: "position_allowance",
      render: (v: number) => `¥${v.toLocaleString()}`,
    },
    {
      title: "交通补贴",
      dataIndex: ["salary", "transport_allowance"],
      key: "transport_allowance",
      render: (v: number) => `¥${v.toLocaleString()}`,
    },
    {
      title: "餐补",
      dataIndex: ["salary", "meal_allowance"],
      key: "meal_allowance",
      render: (v: number) => `¥${v.toLocaleString()}`,
    },
    {
      title: "住房补贴",
      dataIndex: ["salary", "housing_allowance"],
      key: "housing_allowance",
      render: (v: number) => `¥${v.toLocaleString()}`,
    },

    {
      title: "扣款（病事假）",
      dataIndex: ["salary", "sick_leave_deduction"],
      key: "sick_leave_deduction",
      render: (v: number) => `¥${v.toLocaleString()}`,
    },

    {
      title: "个税",
      dataIndex: ["salary", "income_tax"],
      key: "income_tax",
      render: (v: number) => `¥${v.toLocaleString()}`,
    },
    {
      title: "公积金",
      dataIndex: ["salary", "housing_fund"],
      key: "housing_fund",
      render: (v: number) => `¥${v.toLocaleString()}`,
    },
    {
      title: "养老保险",
      dataIndex: ["salary", "pension"],
      key: "pension",
      render: (v: number) => `¥${v.toLocaleString()}`,
    },
    {
      title: "医疗保险",
      dataIndex: ["salary", "medical_insurance"],
      key: "medical_insurance",
      render: (v: number) => `¥${v.toLocaleString()}`,
    },
    {
      title: "失业保险",
      dataIndex: ["salary", "unemployment"],
      key: "unemployment",
      render: (v: number) => `¥${v.toLocaleString()}`,
    },

    {
      title: "应发 (gross)",
      key: "gross",
      render: (_: any, rec: SalaryRecordWithCalc) => {
        const v = rec.gross ?? rec.salary.gross;
        return v ? (
          <span className="font-semibold text-green-600">
            ¥{v.toLocaleString()}
          </span>
        ) : (
          "-"
        );
      },
    },
    {
      title: "实发 (net)",
      key: "net",
      render: (_: any, rec: SalaryRecordWithCalc) => {
        const v = rec.net ?? rec.salary.net;
        return v ? (
          <span className="font-bold text-blue-600">¥{v.toLocaleString()}</span>
        ) : (
          "-"
        );
      },
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
    <div>
      {/* 标题区域 */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4 px-4 py-6 border border-gray-200 rounded-lg">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">跨员工工资筛选</h1>
          <p className="text-gray-500 mt-1">按多条件筛选工资记录</p>
        </div>
        <Button
          type="primary"
          icon={<AiOutlineDownload />}
          onClick={handleExportCSV}
          className="bg-blue-600"
        >
          导出 CSV
        </Button>
      </div>

      {/* 筛选区域 */}
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
          placeholder="月份 1-12"
          value={filterMonth}
          onChange={(e) => {
            setFilterMonth(e.target.value);
            setPage(1);
          }}
          className="w-52"
        />
        <Input
          placeholder="年份"
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
          dataSource={filteredSalaries.slice(
            (page - 1) * pageSize,
            page * pageSize
          )}
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: (p) => setPage(p),
            showSizeChanger: false,
          }}
          className="shadow rounded-lg overflow-hidden  whitespace-nowrap"
          scroll={{ x: "max-content" }}
        />
      )}
    </div>
  );
}
