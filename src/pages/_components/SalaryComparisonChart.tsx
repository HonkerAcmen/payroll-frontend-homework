import React from "react";
import ReactECharts from "echarts-for-react";
import { DeptStats } from "@/types/api";

interface SalaryComparisonChartProps {
  data: DeptStats[];
  loading?: boolean;
}

export default function SalaryComparisonChart({
  data,
  loading = false,
}: SalaryComparisonChartProps) {
  const option = {
    title: {
      text: "部门平均工资对比",
      left: "center",
      textStyle: {
        fontSize: 16,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "axis",
      formatter: (params: any) => {
        if (!Array.isArray(params) || params.length === 0) return "";
        const param = params[0];
        let result = `<div><strong>${param.name}</strong></div>`;
        params.forEach((item: any) => {
          const value =
            typeof item.value === "number"
              ? item.value.toLocaleString()
              : item.value;
          result += `<div>${item.seriesName}: <span style="color: ${item.color};">¥${value}</span></div>`;
        });
        return result;
      },
    },
    legend: {
      data: ["平均应发", "平均实发"],
      top: 30,
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data.map((item) => item.department),
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (value: number) => `¥${(value / 1000).toFixed(0)}k`,
      },
    },
    series: [
      {
        name: "平均应发",
        type: "bar",
        data: data.map((item) =>
          item.count > 0 ? item.total_gross / item.count : 0
        ),
        itemStyle: {
          color: "#3f8600",
        },
      },
      {
        name: "平均实发",
        type: "bar",
        data: data.map((item) =>
          item.count > 0 ? item.total_net / item.count : 0
        ),
        itemStyle: {
          color: "#1890ff",
        },
      },
    ],
  };

  if (loading || !data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        {loading ? "加载中..." : "暂无数据"}
      </div>
    );
  }

  return (
    <ReactECharts
      option={option}
      style={{ height: "400px", width: "100%" }}
      opts={{ renderer: "canvas" }}
    />
  );
}
