import React from "react";
import ReactECharts from "echarts-for-react";
import { DeptStats } from "@/types/api";

interface DeptCountPieChartProps {
  data: DeptStats[];
  loading?: boolean;
}

export default function DeptCountPieChart({
  data,
  loading = false,
}: DeptCountPieChartProps) {
  const option = {
    title: {
      text: "部门人数分布",
      left: "center",
      textStyle: {
        fontSize: 16,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "item",
      formatter: "{a} <br/>{b}: {c} ({d}%)",
    },
    legend: {
      orient: "vertical",
      left: "left",
      top: 60,
    },
    series: [
      {
        name: "部门人数",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: "{b}\n{d}%",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: true,
        },
        data: data.map((item) => ({
          value: item.count,
          name: item.department,
        })),
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
