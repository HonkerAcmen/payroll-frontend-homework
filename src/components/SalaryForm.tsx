import { useEffect } from "react";
import { Form, InputNumber, DatePicker, Button, Card, Space } from "antd";
import {
  AiOutlineUser,
  AiOutlineCalendar,
  AiOutlineMoneyCollect,
} from "react-icons/ai";
import { SalaryRecord } from "@/types/api";
import dayjs from "dayjs";

const { MonthPicker } = DatePicker;

interface SalaryFormProps {
  salary?: SalaryRecord;
  onSubmit: (data: Partial<SalaryRecord>) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function SalaryForm({
  salary,
  onSubmit,
  onCancel,
  isLoading,
}: SalaryFormProps) {
  const [form] = Form.useForm();

  // 编辑时加载初始值
  useEffect(() => {
    if (salary) {
      form.setFieldsValue({
        employeeId: salary.employeeId,
        month: dayjs(salary.month),
        baseSalary: salary.baseSalary,
        bonus: salary.bonus,
        deduction: salary.deduction,
      });
    }
  }, [salary]);

  // 自动计算合计
  const computeTotal = () => {
    const { baseSalary = 0, bonus = 0, deduction = 0 } = form.getFieldsValue();
    return baseSalary + bonus - deduction;
  };

  const handleFinish = (values: any) => {
    const payload: Partial<SalaryRecord> = {
      employeeId: values.employeeId,
      month: values.month ? values.month.format("YYYY-MM") : "",
      baseSalary: values.baseSalary,
      bonus: values.bonus,
      deduction: values.deduction,
      total: computeTotal(),
    };

    onSubmit(payload);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        employeeId: 0,
        month: null,
        baseSalary: 0,
        bonus: 0,
        deduction: 0,
      }}
    >
      <Form.Item
        name="employeeId"
        label={
          <Space>
            <AiOutlineUser />
            <span>员工 ID</span>
          </Space>
        }
        rules={[{ required: true, message: "请输入员工 ID" }]}
      >
        <InputNumber min={1} className="w-full" placeholder="请输入员工 ID" />
      </Form.Item>

      <Form.Item
        name="month"
        label={
          <Space>
            <AiOutlineCalendar />
            <span>月份（YYYY-MM）</span>
          </Space>
        }
        rules={[{ required: true, message: "请选择月份" }]}
      >
        <MonthPicker className="w-full" placeholder="请选择月份" />
      </Form.Item>

      <Form.Item
        name="baseSalary"
        label={
          <Space>
            <AiOutlineMoneyCollect />
            <span>基本工资</span>
          </Space>
        }
        rules={[{ required: true, message: "请输入基本工资" }]}
      >
        <InputNumber min={0} className="w-full" step={0.01} />
      </Form.Item>

      <Form.Item name="bonus" label="奖金">
        <InputNumber min={0} className="w-full" step={0.01} />
      </Form.Item>

      <Form.Item name="deduction" label="扣款">
        <InputNumber min={0} className="w-full" step={0.01} />
      </Form.Item>

      {/* 合计卡片 */}
      <Card className="mt-2" size="small" title="合计（自动计算）">
        <div className="text-2xl font-bold text-blue-600">
          ¥{computeTotal().toFixed(2)}
        </div>
      </Card>

      <div className="flex justify-end mt-6 gap-3">
        <Button onClick={onCancel}>取消</Button>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {salary ? "更新" : "创建"}
        </Button>
      </div>
    </Form>
  );
}
