import { useState, useMemo } from "react";
import {
  useSalaries,
  useCreateSalary,
  useUpdateSalary,
  useDeleteSalary,
  useEmployees,
} from "@/api/hooks";
import { Table, Button, Input, Select, Modal, Spin, Space } from "antd";
import { SalaryRecord, SalaryRecordWithCalc } from "@/types/api";
import SalaryForm from "@/components/SalaryForm";
import {
  AiOutlinePlus,
  AiOutlineDownload,
  AiOutlineEdit,
  AiOutlineDelete,
} from "react-icons/ai";

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

  const salaries = useMemo(() => data || [], [data]);
  const employeeList = useMemo(() => employees || [], [employees]);

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
      ...rows.map((r) => r.join(",")),
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
      `工资记录_${monthStr}_${new Date().toISOString().split("T")[0]}.csv`
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
      title: "年月",
      key: "yearMonth",
      render: (_: any, record: SalaryRecordWithCalc) =>
        `${record.salary.year}-${String(record.salary.month).padStart(2, "0")}`,
    },
    {
      title: "基本工资",
      dataIndex: ["salary", "base_salary"],
      key: "base_salary",
      render: (val: number) => `¥${val.toLocaleString()}`,
    },
    {
      title: "应发",
      dataIndex: "gross",
      key: "gross",
      render: (val: number) => (
        <span style={{ color: "green" }}>¥{val.toLocaleString()}</span>
      ),
    },
    {
      title: "实发",
      dataIndex: "net",
      key: "net",
      render: (val: number) => (
        <span style={{ color: "blue", fontWeight: "bold" }}>
          ¥{val.toLocaleString()}
        </span>
      ),
    },
    {
      title: "操作",
      key: "actions",
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
      {/* 页面标题与操作 */}
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
          value={filterYear || ""}
          onChange={(e) =>
            setFilterYear(e.target.value ? Number(e.target.value) : undefined)
          }
        />
        <Input
          type="number"
          min={1}
          max={12}
          placeholder="月份"
          value={filterMonth || ""}
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
          {Array.from(new Set(employeeList.map((emp) => emp.department))).map(
            (dept) => (
              <Option key={dept} value={dept}>
                {dept}
              </Option>
            )
          )}
        </Select>
      </Space>

      {/* 表格 */}
      <Table
        rowKey={(record: SalaryRecordWithCalc) => record.salary.id}
        columns={columns}
        dataSource={salaries}
        pagination={{ pageSize: 10 }}
        locale={{ emptyText: "暂无数据" }}
      />

      {/* 创建 Modal */}
      <Modal
        title="新增工资记录"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={null}
      >
        <SalaryForm
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
            onSubmit={handleUpdate}
            onCancel={() => setEditingSalary(null)}
            isLoading={update.isPending}
          />
        )}
      </Modal>
    </div>
  );
}
