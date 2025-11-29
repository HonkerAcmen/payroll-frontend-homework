import { Employee, SalaryRecord, TransferRecord } from "@/types/api";

// 假数据
export const mockEmployees: Employee[] = [
  {
    id: 1,
    emp_no: "E001",
    name: "张三",
    department: "技术部",
    gender: "男",
    position: "高级工程师",
    title: "高级",
    base_salary: 15000,
    join_date: "2020-01-15T00:00:00Z",
    is_active: true,
  },
  {
    id: 2,
    emp_no: "E002",
    name: "李四",
    department: "技术部",
    gender: "男",
    position: "工程师",
    title: "中级",
    base_salary: 12000,
    join_date: "2021-03-20T00:00:00Z",
    is_active: true,
  },
  {
    id: 3,
    emp_no: "E003",
    name: "王五",
    department: "产品部",
    gender: "女",
    position: "产品经理",
    title: "高级",
    base_salary: 18000,
    join_date: "2019-06-10T00:00:00Z",
    is_active: true,
  },
  {
    id: 4,
    emp_no: "E004",
    name: "赵六",
    department: "设计部",
    gender: "女",
    position: "UI设计师",
    title: "中级",
    base_salary: 10000,
    join_date: "2022-02-01T00:00:00Z",
    is_active: true,
  },
  {
    id: 5,
    emp_no: "E005",
    name: "钱七",
    department: "运营部",
    gender: "男",
    position: "运营专员",
    title: "初级",
    base_salary: 8000,
    join_date: "2022-08-15T00:00:00Z",
    is_active: true,
  },
  {
    id: 6,
    emp_no: "E006",
    name: "孙八",
    department: "技术部",
    gender: "男",
    position: "架构师",
    title: "高级",
    base_salary: 25000,
    join_date: "2018-05-12T00:00:00Z",
    is_active: true,
  },
  {
    id: 7,
    emp_no: "E007",
    name: "周九",
    department: "产品部",
    gender: "女",
    position: "产品助理",
    title: "初级",
    base_salary: 9000,
    join_date: "2023-01-10T00:00:00Z",
    is_active: true,
  },
  {
    id: 8,
    emp_no: "E008",
    name: "吴十",
    department: "设计部",
    gender: "男",
    position: "视觉设计师",
    title: "中级",
    base_salary: 11000,
    join_date: "2021-09-20T00:00:00Z",
    is_active: true,
  },
];

// 计算应发和实发的辅助函数
function calculateSalary(
  salary: Omit<SalaryRecord, "gross" | "net">,
): SalaryRecord {
  // 应发 = 所有收入项之和 - 病事假扣款
  const gross =
    salary.base_salary +
    salary.work_age_salary +
    salary.position_allowance +
    salary.transport_allowance +
    salary.meal_allowance +
    salary.housing_allowance -
    salary.sick_leave_deduction;

  // 实发 = 应发 - 税费社保之和
  const net =
    gross -
    (salary.income_tax +
      salary.housing_fund +
      salary.pension +
      salary.medical_insurance +
      salary.unemployment);

  return { ...salary, gross, net };
}

export const mockTransferRecords: TransferRecord[] = [
  {
    id: 1,
    employeeId: 1,
    type: "部门变更",
    fromDepartment: "产品部",
    toDepartment: "技术部",
    transferDate: "2020-06-01",
    reason: "岗位调整",
    remark: "从产品转技术",
  },
  {
    id: 2,
    employeeId: 2,
    type: "职位变更",
    fromPosition: "初级工程师",
    toPosition: "工程师",
    transferDate: "2022-01-01",
    reason: "晋升",
    remark: "表现优秀",
  },
  {
    id: 3,
    employeeId: 3,
    type: "调入",
    toDepartment: "产品部",
    toPosition: "产品经理",
    transferDate: "2019-06-10",
    reason: "新入职",
    remark: "",
  },
];

// 模拟 API 延迟
export const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// 模拟分页
export function paginate<T>(data: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return {
    data: data.slice(start, end),
    total: data.length,
    page,
    pageSize,
    totalPages: Math.ceil(data.length / pageSize),
  };
}
