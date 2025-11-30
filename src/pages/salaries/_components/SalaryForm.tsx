import { useEffect, useState } from "react";
import {
  Form,
  InputNumber,
  DatePicker,
  Button,
  Space,
  Input,
  Select,
} from "antd";
import {
  AiOutlineUser,
  AiOutlineCalendar,
  AiOutlineMoneyCollect,
} from "react-icons/ai";
import { SalaryRecord, Employee } from "@/types/api";
import dayjs from "dayjs";

const { MonthPicker } = DatePicker;

interface SalaryFormProps {
  salary?: SalaryRecord;
  employees?: Employee[];
  onSubmit: (
    data: Partial<SalaryRecord> & { emp_no?: string }
  ) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface SalaryItems {
  title: string;
  required: boolean;
  type: "number" | "month" | "text";
  placeholder: string;
  alertMessage: string;
  formfields: keyof SalaryRecord;
}

const formItems: SalaryItems[] = [
  {
    title: "年份",
    required: true,
    type: "number",
    formfields: "year",
    placeholder: "请输入年份",
    alertMessage: "请输入年份",
  },
  {
    title: "月份",
    required: true,
    type: "number",
    formfields: "month",
    placeholder: "请输入月份",
    alertMessage: "请输入月份",
  },
  {
    title: "基本工资",
    required: true,
    type: "number",
    formfields: "base_salary",
    placeholder: "请输入基本工资",
    alertMessage: "请输入基本工资",
  },
  {
    title: "工龄工资",
    required: true,
    type: "number",
    formfields: "work_age_salary",
    placeholder: "请输入工龄工资",
    alertMessage: "请输入工龄工资",
  },
  {
    title: "职务津贴",
    required: true,
    type: "number",
    formfields: "position_allowance",
    placeholder: "请输入职务津贴",
    alertMessage: "请输入职务津贴",
  },
  {
    title: "交通补贴",
    required: true,
    type: "number",
    formfields: "transport_allowance",
    placeholder: "请输入交通补贴",
    alertMessage: "请输入交通补贴",
  },
  {
    title: "餐补",
    required: true,
    type: "number",
    formfields: "meal_allowance",
    placeholder: "请输入餐补",
    alertMessage: "请输入餐补",
  },
  {
    title: "住房补贴",
    required: true,
    type: "number",
    formfields: "housing_allowance",
    placeholder: "请输入住房补贴",
    alertMessage: "请输入住房补贴",
  },
  {
    title: "病事假扣款",
    required: true,
    type: "number",
    formfields: "sick_leave_deduction",
    placeholder: "请输入扣款",
    alertMessage: "请输入扣款",
  },
  {
    title: "个税",
    required: true,
    type: "number",
    formfields: "income_tax",
    placeholder: "请输入个税",
    alertMessage: "请输入个税",
  },
  {
    title: "公积金",
    required: true,
    type: "number",
    formfields: "housing_fund",
    placeholder: "请输入住房公积金",
    alertMessage: "请输入住房公积金",
  },
  {
    title: "养老保险",
    required: true,
    type: "number",
    formfields: "pension",
    placeholder: "请输入养老保险",
    alertMessage: "请输入养老保险",
  },
  {
    title: "医疗保险",
    required: true,
    type: "number",
    formfields: "medical_insurance",
    placeholder: "请输入医疗保险",
    alertMessage: "请输入医疗保险",
  },
  {
    title: "失业保险",
    required: true,
    type: "number",
    formfields: "unemployment",
    placeholder: "请输入失业保险",
    alertMessage: "请输入失业保险",
  },
];

const { Option } = Select;

export default function SalaryForm({
  salary,
  employees = [],
  onSubmit,
  onCancel,
  isLoading,
}: SalaryFormProps) {
  const [form] = Form.useForm();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );

  // 编辑模式
  useEffect(() => {
    if (salary) {
      form.setFieldsValue({
        ...salary,
        emp_no: salary.Employee?.emp_no,
      });
      // 编辑模式下，如果有员工信息，设置选中的员工
      if (salary.Employee) {
        setSelectedEmployee(salary.Employee);
      }
    }
  }, [salary, form]);

  // 监听员工选择变化，自动填充基本工资（仅创建模式）
  const handleEmployeeChange = (empNo: string) => {
    const employee = employees.find((emp) => emp.emp_no === empNo);
    if (employee) {
      setSelectedEmployee(employee);
      // 只有在创建模式下（没有 salary）才自动填充基本工资
      if (!salary) {
        form.setFieldsValue({
          base_salary: employee.base_salary,
        });
      }
    } else {
      setSelectedEmployee(null);
    }
  };

  // 自动计算 gross / net
  const computeGross = () => {
    const values = form.getFieldsValue();
    return (
      values.base_salary +
      values.work_age_salary +
      values.position_allowance +
      values.transport_allowance +
      values.meal_allowance +
      values.housing_allowance
    );
  };

  const computeNet = () => {
    const g = computeGross();
    const values = form.getFieldsValue();
    return (
      g -
      values.sick_leave_deduction -
      values.income_tax -
      values.housing_fund -
      values.pension -
      values.medical_insurance -
      values.unemployment
    );
  };

  // 提交
  const handleFinish = (values: any) => {
    onSubmit({
      ...values,
      gross: computeGross(),
      net: computeNet(),
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={
        salary ? { ...salary, emp_no: salary.Employee?.emp_no } : {}
      }
    >
      {/* 员工选择器 */}
      <Form.Item
        name="emp_no"
        label="职工号"
        rules={[
          {
            required: true,
            message: "请选择员工",
          },
        ]}
      >
        <Select
          placeholder="请选择员工"
          showSearch
          onChange={handleEmployeeChange}
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={employees.map((emp) => ({
            value: emp.emp_no,
            label: `${emp.emp_no} - ${emp.name} (${emp.department})`,
          }))}
        />
      </Form.Item>

      {formItems.map((item) => {
        // 基本工资字段特殊处理：从员工信息读取，只读
        const isBaseSalary = item.formfields === "base_salary";
        const isYearOrMonth =
          item.formfields === "year" || item.formfields === "month";
        // 判断是否有选中的员工（创建模式）或已有员工信息（编辑模式）
        const hasEmployeeInfo =
          selectedEmployee || (salary?.Employee && isBaseSalary);

        return (
          <Form.Item
            key={item.formfields}
            name={item.formfields}
            label={item.title}
            rules={[
              {
                required: item.required,
                message: item.alertMessage,
              },
            ]}
          >
            {item.type === "number" ? (
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                step={isYearOrMonth ? 1 : 0.01}
                precision={isYearOrMonth ? 0 : 2}
                parser={(value) => {
                  if (isYearOrMonth) {
                    const num = value?.replace(/\D/g, "");
                    return num ? Number(num) : 0;
                  }
                  return value ? Number(value) : 0;
                }}
                placeholder={item.placeholder}
                disabled={isBaseSalary}
                addonAfter={
                  isBaseSalary && hasEmployeeInfo
                    ? "（来自员工信息）"
                    : undefined
                }
              />
            ) : item.type === "month" ? (
              <MonthPicker className="w-full" placeholder={item.placeholder} />
            ) : (
              <Input placeholder={item.placeholder} />
            )}
          </Form.Item>
        );
      })}

      <div className="flex justify-end mt-6 gap-3">
        <Button onClick={onCancel}>取消</Button>
        <Button type="primary" htmlType="submit" loading={isLoading}>
          {salary ? "更新" : "创建"}
        </Button>
      </div>
    </Form>
  );
}
