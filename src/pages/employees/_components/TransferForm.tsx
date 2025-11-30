import { Form, Input, Select, Button, Switch } from "antd";
import { TransferRequest } from "@/types/api";
import { Employee } from "@/types/api";

const { Option } = Select;
const { TextArea } = Input;

interface TransferFormProps {
  employee: Employee;
  onSubmit: (data: TransferRequest) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function TransferForm({
  employee,
  onSubmit,
  onCancel,
  isLoading,
}: TransferFormProps) {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    const transferData: TransferRequest = {};

    if (
      values.new_department &&
      values.new_department !== employee.department
    ) {
      transferData.new_department = values.new_department;
    }

    if (values.new_position && values.new_position !== employee.position) {
      transferData.new_position = values.new_position;
    }

    if (values.new_title && values.new_title !== employee.title) {
      transferData.new_title = values.new_title;
    }

    if (values.is_active !== undefined) {
      transferData.is_active = values.is_active;
    }

    onSubmit(transferData);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        new_department: employee.department,
        new_position: employee.position,
        new_title: employee.title,
        is_active: employee.is_active,
      }}
    >
      <Form.Item
        name="new_department"
        label="新部门"
        rules={[{ required: true, message: "请选择新部门" }]}
      >
        <Input placeholder="请输入新部门" />
      </Form.Item>

      <Form.Item
        name="new_position"
        label="新职位"
        rules={[{ required: true, message: "请输入新职位" }]}
      >
        <Input placeholder="请输入新职位" />
      </Form.Item>

      <Form.Item name="new_title" label="新职称">
        <Input placeholder="请输入新职称（可选）" />
      </Form.Item>

      <Form.Item name="is_active" label="在职状态" valuePropName="checked">
        <Switch checkedChildren="在职" unCheckedChildren="离职" />
      </Form.Item>

      <div className="flex justify-end gap-3 mt-6">
        <Button onClick={onCancel}>取消</Button>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          确认调动
        </Button>
      </div>
    </Form>
  );
}
