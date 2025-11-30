import { useState } from "react";
import {
  Card,
  Statistic,
  Select,
  Row,
  Col,
  Spin,
  Table,
  Tag,
  message,
} from "antd";
import { useDeptStats, useSummaryStats, useEmployees } from "@/api/hooks";
import {
  AiFillHome,
  AiOutlineDollar,
  AiOutlineUser,
  AiOutlineTeam,
} from "react-icons/ai";
import dayjs from "dayjs";
import DeptSalaryChart from "./_components/DeptSalaryChart";
import DeptCountPieChart from "./_components/DeptCountPieChart";
import SalaryComparisonChart from "./_components/SalaryComparisonChart";

const { Option } = Select;

export default function Home() {
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );

  const {
    data: summaryStats,
    isLoading: summaryLoading,
    error: summaryError,
  } = useSummaryStats(selectedYear, selectedMonth);
  const {
    data: deptStats,
    isLoading: deptLoading,
    error: deptError,
  } = useDeptStats(selectedYear, selectedMonth);
  const { data: employees, isLoading: employeesLoading } = useEmployees();

  // 调试信息
  if (typeof window !== "undefined") {
    console.log("=== 统计页面调试信息 ===");
    console.log("查询参数:", { year: selectedYear, month: selectedMonth });
    console.log("部门统计数据:", deptStats);
    console.log("部门统计错误:", deptError);
    console.log("汇总统计数据:", summaryStats);
    console.log("汇总统计错误:", summaryError);
    console.log("部门统计加载中:", deptLoading);
    console.log("汇总统计加载中:", summaryLoading);
  }

  const deptColumns = [
    {
      title: "部门",
      dataIndex: "department",
      key: "department",
      render: (dept: string) => <Tag color="blue">{dept}</Tag>,
    },
    {
      title: "人数",
      dataIndex: "count",
      key: "count",
      align: "right" as const,
    },
    {
      title: "应发总额",
      dataIndex: "total_gross",
      key: "total_gross",
      align: "right" as const,
      render: (val: number | null | undefined) => (
        <span className="text-green-600 font-semibold">
          {val != null ? `¥${val.toLocaleString()}` : "-"}
        </span>
      ),
    },
    {
      title: "实发总额",
      dataIndex: "total_net",
      key: "total_net",
      align: "right" as const,
      render: (val: number | null | undefined) => (
        <span className="text-blue-600 font-semibold">
          {val != null ? `¥${val.toLocaleString()}` : "-"}
        </span>
      ),
    },
  ];

  // 生成年份选项（最近5年）
  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = currentDate.getFullYear() - i;
    return year;
  });

  return (
    <div className="space-y-6">
      {/* 标题和筛选 */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border border-gray-200 px-4 py-6 rounded-lg">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <AiFillHome className="text-gray-600" />
            系统概览
          </h1>
          <p className="text-gray-500 mt-1">查看系统统计数据和部门汇总</p>
        </div>
        <div className="flex gap-2">
          <Select
            value={selectedYear}
            onChange={setSelectedYear}
            style={{ width: 120 }}
          >
            {yearOptions.map((year) => (
              <Option key={year} value={year}>
                {year}年
              </Option>
            ))}
          </Select>
          <Select
            value={selectedMonth}
            onChange={setSelectedMonth}
            style={{ width: 120 }}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <Option key={month} value={month}>
                {month}月
              </Option>
            ))}
          </Select>
        </div>
      </div>

      {/* 整体统计卡片 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="员工总数"
              value={employees?.length || 0}
              prefix={<AiOutlineUser className="text-blue-500" />}
              loading={employeesLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="工资记录数"
              value={summaryStats?.count || 0}
              prefix={<AiOutlineDollar className="text-green-500" />}
              loading={summaryLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="应发总额"
              value={summaryStats?.total_gross || 0}
              prefix="¥"
              precision={2}
              valueStyle={{ color: "#3f8600" }}
              loading={summaryLoading}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="实发总额"
              value={summaryStats?.total_net || 0}
              prefix="¥"
              precision={2}
              valueStyle={{ color: "#1890ff" }}
              loading={summaryLoading}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card>
            <DeptSalaryChart data={deptStats || []} loading={deptLoading} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card>
            <DeptCountPieChart data={deptStats || []} loading={deptLoading} />
          </Card>
        </Col>
        <Col xs={24}>
          <Card>
            <SalaryComparisonChart
              data={deptStats || []}
              loading={deptLoading}
            />
          </Card>
        </Col>
      </Row>

      {/* 部门统计表格 */}
      <Card
        title={
          <span className="flex items-center gap-2">
            <AiOutlineTeam className="text-blue-500" />
            部门统计 ({selectedYear}年{selectedMonth}月)
          </span>
        }
      >
        {deptLoading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : deptError ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <p className="text-red-500 mb-2">加载失败</p>
            <p className="text-sm">
              {deptError instanceof Error
                ? deptError.message
                : "无法获取部门统计数据，请检查网络连接或稍后重试"}
            </p>
          </div>
        ) : !deptStats || deptStats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <p className="mb-2">暂无数据</p>
            <p className="text-sm">
              {selectedYear}年{selectedMonth}月暂无工资记录，请选择其他月份查看
            </p>
          </div>
        ) : (
          <Table
            rowKey="department"
            columns={deptColumns}
            dataSource={deptStats}
            pagination={false}
            locale={{ emptyText: "暂无数据" }}
          />
        )}
      </Card>
    </div>
  );
}
