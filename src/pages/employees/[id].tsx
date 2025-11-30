import { useRouter } from "next/router";
import { useState } from "react";
import {
  useEmployee,
  useUpdateEmployee,
  useSalaryRecords,
  useTransferRecords,
} from "@/api/hooks";
import EmployeeForm from "@/components/EmployeeForm";
import { Tabs, Button, Spin, Table, Tag, message } from "antd";
import { Employee } from "@/types/api";
import Link from "next/link";
import { AiOutlineArrowLeft, AiOutlineEdit } from "react-icons/ai";

const { TabPane } = Tabs;

export default function EmployeeDetailPage() {
  const { id } = useRouter().query;
  const employeeId = Number(id);
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
      message.success("更新成功");
    } catch (error) {
      console.error(error);
      message.error("更新失败");
    }
  };

  if (employeeLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm">
        <p className="text-lg text-gray-500 mb-4">员工不存在</p>
        <Link href="/employees">
          <Button icon={<AiOutlineArrowLeft />}>返回员工列表</Button>
        </Link>
      </div>
    );
  }

  const salaryColumns = [
    { title: "月份", dataIndex: "month", key: "month" },
    {
      title: "基本工资",
      dataIndex: "baseSalary",
      key: "baseSalary",
      render: (val: number) => `¥${val.toLocaleString()}`,
    },
    {
      title: "奖金",
      dataIndex: "bonus",
      key: "bonus",
      render: (val: number) => `¥${val.toLocaleString()}`,
    },
    {
      title: "扣款",
      dataIndex: "deduction",
      key: "deduction",
      render: (val: number) => `¥${val.toLocaleString()}`,
    },
    {
      title: "合计",
      dataIndex: "total",
      key: "total",
      render: (val: number) => <b>¥{val.toLocaleString()}</b>,
    },
  ];

  const transferColumns = [
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      render: (type: string) => <Tag color="purple">{type}</Tag>,
    },
    { title: "原部门", dataIndex: "fromDepartment", key: "fromDepartment" },
    { title: "新部门", dataIndex: "toDepartment", key: "toDepartment" },
    { title: "原职位", dataIndex: "fromPosition", key: "fromPosition" },
    { title: "新职位", dataIndex: "toPosition", key: "toPosition" },
    { title: "调动日期", dataIndex: "transferDate", key: "transferDate" },
    { title: "原因", dataIndex: "reason", key: "reason" },
    { title: "备注", dataIndex: "remark", key: "remark" },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-4">
      {/* 返回按钮和标题 */}
      <div className="flex justify-between items-center mb-4">
        <Link href="/employees">
          <Button icon={<AiOutlineArrowLeft />}>返回员工列表</Button>
        </Link>
        <h1 className="text-2xl font-bold">{employee.name} - 员工详情</h1>
        <div></div>
      </div>

      {/* 基本信息 / 编辑表单 */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {isEditing ? (
          <EmployeeForm
            employee={employee}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            isLoading={update.isPending}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <b>ID:</b> {employee.id}
            </div>
            <div>
              <b>姓名:</b> {employee.name}
            </div>
            <div>
              <b>部门:</b> <Tag color="blue">{employee.department}</Tag>
            </div>
            <div>
              <b>职位:</b> {employee.position}
            </div>
            <div>
              <b>薪资:</b>{" "}
              <span className="text-green-600 font-bold">
                ¥{employee.base_salary.toLocaleString()}
              </span>
            </div>
            <div>
              <b>入职日期:</b> {employee.created_at}
            </div>
            <div className="md:col-span-2">
              <Button
                type="primary"
                icon={<AiOutlineEdit />}
                onClick={() => setIsEditing(true)}
              >
                编辑信息
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultActiveKey="salary">
        <TabPane tab="工资记录" key="salary">
          <Table
            rowKey="id"
            dataSource={salaryRecords || []}
            columns={salaryColumns}
            loading={salaryLoading}
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: "暂无工资记录" }}
          />
        </TabPane>
        <TabPane tab="职工调动记录" key="transfer">
          <Table
            rowKey="id"
            dataSource={transferRecords || []}
            columns={transferColumns}
            loading={transferLoading}
            pagination={{ pageSize: 10 }}
            locale={{ emptyText: "暂无调动记录" }}
          />
        </TabPane>
      </Tabs>
    </div>
  );
}
