// ./pages/salaries/index.tsx
import { useState, useMemo } from "react";
import {
  useSalaries,
  useCreateSalary,
  useUpdateSalary,
  useDeleteSalary,
  useEmployees,
} from "@/api/hooks";
import {
  Table,
  Button,
  Input,
  Select,
  Modal,
  Spin,
  Space,
  message,
} from "antd";
import { SalaryRecord, SalaryRecordWithCalc, Employee } from "@/types/api";
import SalaryForm from "./_components/SalaryForm";
import {
  AiOutlinePlus,
  AiOutlineDownload,
  AiOutlineEdit,
  AiOutlineDelete,
} from "react-icons/ai";
import { exportToCSV } from "@/utils/csvExport";

const { Option } = Select;

export default function SalariesPage() {
  const [filterYear, setFilterYear] = useState<number | undefined>(
    new Date().getFullYear()
  );
  const [filterMonth, setFilterMonth] = useState<number | undefined>(
    new Date().getMonth() + 1
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

  const handleCreate = async (
    formData: Partial<SalaryRecord> & { emp_no?: string }
  ) => {
    if (!formData.emp_no) {
      message.error("请选择员工");
      return;
    }
    // 根据 emp_no 找到对应的 employee_id
    const employee = employeeList.find(
      (emp: Employee) => emp.emp_no === formData.emp_no
    );
    if (!employee) {
      message.error("未找到对应的员工");
      return;
    }
    try {
      const { emp_no, ...restData } = formData;
      await create.mutateAsync({
        ...restData,
        employee_id: employee.id,
      } as Partial<SalaryRecord> & { employee_id: number });
      setIsCreateModalOpen(false);
    } catch (error) {
      // 错误已在全局拦截器中处理
      console.error("创建工资记录失败:", error);
    }
  };

  const handleUpdate = async (
    formData: Partial<SalaryRecord> & { emp_no?: string }
  ) => {
    if (!editingSalary) return;
    try {
      let updateData = { ...formData };
      // 如果更改了 emp_no，需要找到新的 employee_id
      if (
        formData.emp_no &&
        formData.emp_no !== editingSalary.Employee?.emp_no
      ) {
        const employee = employeeList.find(
          (emp: Employee) => emp.emp_no === formData.emp_no
        );
        if (!employee) {
          message.error("未找到对应的员工");
          return;
        }
        const { emp_no, ...restData } = formData;
        updateData = {
          ...restData,
          employee_id: employee.id,
        };
      } else {
        // 移除 emp_no，保持原有的 employee_id
        const { emp_no, ...restData } = formData;
        updateData = restData;
      }
      await update.mutateAsync({ id: editingSalary.id, ...updateData });
      setEditingSalary(null);
    } catch (error) {
      // 错误已在全局拦截器中处理
      console.error("更新工资记录失败:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("确定要删除这条工资记录吗？")) return;
    try {
      await deleteSalary.mutateAsync(id);
    } catch (error) {
      // 错误已在全局拦截器中处理
      console.error("删除工资记录失败:", error);
    }
  };

  const handleExportCSV = () => {
    if (!salaries.length) {
      message.warning("没有数据可导出");
      return;
    }

    const monthStr =
      filterYear && filterMonth
        ? `${filterYear}-${String(filterMonth).padStart(2, "0")}`
        : "全部";

    exportToCSV({
      filename: `工资记录_${monthStr}_${new Date().toISOString().split("T")[0]}.csv`,
      headers: [
        "ID",
        "职工号",
        "姓名",
        "部门",
        "年份",
        "月份",
        "基本工资",
        "应发",
        "实发",
      ],
      rows: salaries.map((s: SalaryRecordWithCalc) => [
        s.salary.id,
        s.salary.Employee?.emp_no ?? "",
        s.salary.Employee?.name ?? "",
        s.salary.Employee?.department ?? "",
        s.salary.year,
        s.salary.month,
        s.salary.base_salary,
        s.gross ?? s.salary.gross ?? "",
        s.net ?? s.salary.net ?? "",
      ]),
    });
  };

  // 字段列表（按你的 SalaryRecord 接口）
  const salaryFields = [
    { key: "id", title: "ID", isMoney: false },
    { key: "year", title: "年份", isMoney: false },
    { key: "month", title: "月份", isMoney: false },

    // 收入项
    { key: "base_salary", title: "基本工资", isMoney: true },
    { key: "work_age_salary", title: "工龄工资", isMoney: true },
    { key: "position_allowance", title: "职务津贴", isMoney: true },
    { key: "transport_allowance", title: "交通补贴", isMoney: true },
    { key: "meal_allowance", title: "餐补", isMoney: true },
    { key: "housing_allowance", title: "住房补贴", isMoney: true },

    // 扣款项
    { key: "sick_leave_deduction", title: "病事假扣款", isMoney: true },

    // 税费社保
    { key: "income_tax", title: "个人所得税", isMoney: true },
    { key: "housing_fund", title: "住房公积金", isMoney: true },
    { key: "pension", title: "养老保险", isMoney: true },
    { key: "medical_insurance", title: "医疗保险", isMoney: true },
    { key: "unemployment", title: "失业保险", isMoney: true },

    // 计算字段
    { key: "gross", title: "应发", isMoney: true },
    { key: "net", title: "实发", isMoney: true },

    { key: "created_at", title: "创建时间", isMoney: false },
    { key: "updated_at", title: "更新时间", isMoney: false },
  ];

  // 自动生成 columns
  const dynamicColumns = salaryFields.map((f) => {
    return {
      title: f.title,
      dataIndex: ["salary", f.key],
      key: f.key,
      // 确保表头不换行
      className: "whitespace-nowrap",
      onHeaderCell: () => ({ className: "whitespace-nowrap" }),
      render: (val: any, rec: SalaryRecordWithCalc) => {
        // 如果 salary.gross/net 可能出现在 record.top-level，则尝试取外层值
        if (
          (f.key === "gross" || f.key === "net") &&
          (rec as any)[f.key] !== undefined
        ) {
          const v = (rec as any)[f.key];
          return typeof v === "number" ? `¥${v.toLocaleString()}` : (v ?? "-");
        }
        if (f.isMoney && typeof val === "number") {
          return `¥${val.toLocaleString()}`;
        }
        if (!val && val !== 0) return "-";
        return val;
      },
    };
  });

  // Employee 信息列
  const employeeColumns = [
    {
      title: "职工号",
      key: "emp_no",
      className: "whitespace-nowrap",
      onHeaderCell: () => ({ className: "whitespace-nowrap" }),
      render: (_: any, rec: SalaryRecordWithCalc) =>
        rec.salary.Employee?.emp_no ?? "-",
    },
    {
      title: "姓名",
      key: "name",
      className: "whitespace-nowrap",
      onHeaderCell: () => ({ className: "whitespace-nowrap" }),
      render: (_: any, rec: SalaryRecordWithCalc) =>
        rec.salary.Employee?.name ?? "-",
    },
    {
      title: "部门",
      key: "department",
      className: "whitespace-nowrap",
      onHeaderCell: () => ({ className: "whitespace-nowrap" }),
      render: (_: any, rec: SalaryRecordWithCalc) =>
        rec.salary.Employee?.department ?? "-",
    },
    {
      title: "职务",
      key: "position",
      className: "whitespace-nowrap",
      onHeaderCell: () => ({ className: "whitespace-nowrap" }),
      render: (_: any, rec: SalaryRecordWithCalc) =>
        rec.salary.Employee?.position ?? "-",
    },
  ];

  const columns = [
    ...dynamicColumns.slice(0, 1), // ID
    ...employeeColumns, // Employee 信息
    ...dynamicColumns.slice(1), // 其他字段
    {
      title: "操作",
      key: "actions",
      fixed: "right" as const,
      className: "whitespace-nowrap",
      onHeaderCell: () => ({ className: "whitespace-nowrap" }),
      render: (_: any, record: SalaryRecordWithCalc) => (
        <Space>
          <Button
            type="link"
            icon={<AiOutlineEdit />}
            onClick={() => setEditingSalary(record.salary)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<AiOutlineDelete />}
            onClick={() => handleDelete(record.salary.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      {/* 页面头部 */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4 border border-gray-200 px-4 py-6 rounded-lg">
        <div>
          <h1 className="text-2xl font-bold">工资管理</h1>
          <p className="text-gray-500">管理和查看所有工资记录</p>
        </div>
        <Space>
          <Button icon={<AiOutlineDownload />} onClick={handleExportCSV}>
            导出 CSV
          </Button>
          <Button
            type="primary"
            icon={<AiOutlinePlus />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            新增工资记录
          </Button>
        </Space>
      </div>

      {/* 筛选 */}
      <Space className="mb-6" wrap>
        <Input
          type="number"
          placeholder="年份"
          value={filterYear ?? ""}
          onChange={(e) =>
            setFilterYear(e.target.value ? Number(e.target.value) : undefined)
          }
        />
        <Input
          type="number"
          min={1}
          max={12}
          placeholder="月份"
          value={filterMonth ?? ""}
          onChange={(e) =>
            setFilterMonth(e.target.value ? Number(e.target.value) : undefined)
          }
        />
        <Select
          placeholder="选择部门"
          style={{ width: 200 }}
          value={filterDepartment || undefined}
          onChange={(val) => setFilterDepartment(val)}
          allowClear
        >
          {Array.from(
            new Set(
              (employeeList || [])
                .map((emp: any) => emp?.department)
                .filter((d: any) => !!d)
            )
          ).map((dept: string) => (
            <Option key={dept} value={dept}>
              {dept}
            </Option>
          ))}
        </Select>
      </Space>

      {/* 表格容器：AntD scroll + 外层 overflow-x-auto 双保险 */}
      <div className="overflow-x-auto">
        <Table
          rowKey={(record: SalaryRecordWithCalc) => record.salary.id}
          columns={columns}
          dataSource={salaries}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "暂无数据" }}
          scroll={{ x: "max-content" }}
        />
      </div>

      {/* 新增 Modal */}
      <Modal
        title="新增工资记录"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={null}
      >
        <SalaryForm
          employees={employeeList}
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={create.isPending}
        />
      </Modal>

      {/* 编辑 Modal */}
      <Modal
        title="编辑工资记录"
        open={!!editingSalary}
        onCancel={() => setEditingSalary(null)}
        footer={null}
      >
        {editingSalary && (
          <SalaryForm
            salary={editingSalary}
            employees={employeeList}
            onSubmit={handleUpdate}
            onCancel={() => setEditingSalary(null)}
            isLoading={update.isPending}
          />
        )}
      </Modal>
    </div>
  );
}
