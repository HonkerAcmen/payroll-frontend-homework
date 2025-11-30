import { Employee } from "@/types/api";
import { Form as AntForm, Input, DatePicker, InputNumber } from "antd";

export interface formItemProps {
  title: string;
  required: boolean;
  placeholder?: string;
  type: "text" | "number" | "date";
  formfields: keyof Employee;
}

interface FormProps {
  param: formItemProps[];
}

export default function Form({ param }: FormProps) {
  return (
    <>
      {param.map((v) => (
        <AntForm.Item
          key={v.formfields}
          name={v.formfields}
          label={v.title}
          rules={[{ required: v.required, message: `${v.title}不能为空` }]}
        >
          {v.type === "text" && <Input placeholder={v.placeholder} />}

          {v.type === "number" && (
            <InputNumber
              style={{ width: "100%" }}
              placeholder={v.placeholder}
            />
          )}

          {v.type === "date" && (
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          )}
        </AntForm.Item>
      ))}
    </>
  );
}
