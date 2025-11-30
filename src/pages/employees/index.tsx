import {
  useEmployees,
  useCreateEmployee,
  useDeleteEmployee,
} from "@/api/hooks";
import { useState, useMemo } from "react";
import { Table, Input, Select, Button, Modal, Tag, Space, message } from "antd";
import { Employee } from "@/types/api";
import { AiFillPlusCircle } from "react-icons/ai";
import EmployeeForm from "@/pages/employees/_components/EmployeeForm";

const { Option } = Select;

export default function EmployeePage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchName, setSearchName] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const limit = pageSize;
  const offset = (page - 1) * pageSize;

  const { data, isLoading } = useEmployees({
    limit: limit.toString(),
    offset: offset.toString(),
    department: filterDepartment,
  });

  const create = useCreateEmployee();
  const deleteEmployee = useDeleteEmployee();

  const employees = useMemo(() => {
    if (!data) return [];
    let filtered = data;
    if (searchName)
      filtered = filtered.filter((e) => e.name.includes(searchName));
    return filtered;
  }, [data, searchName]);

  const total = employees.length;

  const departments = useMemo(() => {
    const set = new Set<string>();
    data?.forEach((e) => e.department && set.add(e.department));
    return Array.from(set).sort();
  }, [data]);

  const handleDelete = async (id: number) => {
    Modal.confirm({
      title: "确定要删除这个员工吗？",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        try {
          await deleteEmployee.mutateAsync(id);
          message.success("删除成功");
        } catch (error) {
          message.error("删除失败");
          console.error(error);
        }
      },
    });
  };

  const handleCreate = async (formData: Partial<Employee>) => {
    try {
      await create.mutateAsync(formData);
      setIsCreateModalOpen(false);
      message.success("创建成功");
      setSearchName(""); // 可选：刷新列表
    } catch (error) {
      message.error("创建失败");
      console.error(error);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "姓名", dataIndex: "name", key: "name" },
    {
      title: "部门",
      dataIndex: "department",
      key: "department",
      render: (dept: string) => <Tag color="blue">{dept}</Tag>,
    },
    { title: "职位", dataIndex: "position", key: "position" },
    {
      title: "薪资",
      dataIndex: "base_salary",
      key: "base_salary",
      render: (salary: number) => `¥${salary.toLocaleString()}`,
    },
    {
      title: "入职日期",
      dataIndex: "join_date",
      key: "join_date",
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString("zh-CN") : "-",
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: Employee) => (
        <Space size="middle">
          <Button type="link" href={`/employees/${record.id}`}>
            查看详情
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="  min-h-190 ">
      <div className="flex justify-between items-center mb-4 border border-gray-200 px-4 py-6 rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800">员工管理</h1>
        <Button
          type="primary"
          icon={<AiFillPlusCircle />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          新增员工
        </Button>
      </div>

      <Space className="mb-4" size="middle">
        <Input
          placeholder="搜索员工姓名"
          value={searchName}
          onChange={(e) => {
            setSearchName(e.target.value);
            setPage(1);
          }}
          allowClear
        />
        <Select
          placeholder="选择部门"
          value={filterDepartment || undefined}
          onChange={(val) => {
            setFilterDepartment(val || "");
            setPage(1);
          }}
          allowClear
        >
          {departments.map((dept) => (
            <Option key={dept} value={dept}>
              {dept}
            </Option>
          ))}
        </Select>
      </Space>

      <Table
        rowKey="id"
        loading={isLoading}
        columns={columns}
        dataSource={employees}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: (p) => setPage(p),
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      {/* 新增员工 Modal */}
      <Modal
        title="新增员工"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={null}
      >
        <EmployeeForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={create.isPending}
        />
      </Modal>
    </div>
  );
}
