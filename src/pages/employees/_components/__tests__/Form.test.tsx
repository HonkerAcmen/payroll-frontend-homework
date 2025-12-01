import { render, screen } from "@testing-library/react";
import React from "react";
import { Form as AntForm } from "antd";
import Form, { formItemProps } from "../Form";

describe("Employees Form component", () => {
  const items: formItemProps[] = [
    {
      title: "姓名",
      required: true,
      placeholder: "请输入姓名",
      type: "text",
      formfields: "name",
    },
    {
      title: "年龄",
      required: false,
      placeholder: "请输入年龄",
      type: "number",
      formfields: "age",
    },
    {
      title: "入职日期",
      required: true,
      placeholder: "请选择日期",
      type: "date",
      formfields: "hire_date",
    },
  ] as unknown as formItemProps[];

  it("根据配置渲染三种不同类型的表单项", () => {
    render(
      <AntForm layout="vertical">
        <Form param={items} />
      </AntForm>
    );

    expect(screen.getByLabelText("姓名")).toBeInTheDocument();
    expect(screen.getByLabelText("年龄")).toBeInTheDocument();
    expect(screen.getByLabelText("入职日期")).toBeInTheDocument();
  });
});


