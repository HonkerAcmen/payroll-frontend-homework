import { useEffect } from "react";
import { Employee } from "@/types/api";
import { Button, Form as AntForm } from "antd";
import Form, { formItemProps } from "./Form";
import dayjs from "dayjs";

interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (data: Partial<Employee>) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export default function EmployeeForm({
  employee,
  onSubmit,
  onCancel,
  isLoading,
  isEdit,
}: EmployeeFormProps) {
  const [form] = AntForm.useForm();

  useEffect(() => {
    if (employee) {
      form.setFieldsValue({
        ...employee,
        join_date: employee.join_date ? dayjs(employee.join_date) : null,
      });
    }
  }, [employee]);

  const formItems: formItemProps[] = [
    { title: "工号", required: true, type: "text", formfields: "emp_no" },
    { title: "姓名", required: true, type: "text", formfields: "name" },
    { title: "部门", required: true, type: "text", formfields: "department" },
    { title: "职位", required: true, type: "text", formfields: "position" },
    {
      title: "薪资",
      required: true,
      type: "number",
      formfields: "base_salary",
    },
    {
      title: "入职日期",
      required: true,
      type: "date",
      formfields: "join_date",
    },
  ];

  const handleFinish = (values: any) => {
    const submitData = {
      ...values,
      join_date: values.join_date
        ? values.join_date.format("YYYY-MM-DD")
        : undefined,
    };
    onSubmit(submitData);
  };

  return (
    <AntForm form={form} layout="vertical" onFinish={handleFinish}>
      <Form param={formItems} />

      <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
        <Button onClick={onCancel}>取消</Button>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {isEdit ? "修改" : "创建"}
        </Button>
      </div>
    </AntForm>
  );
}
