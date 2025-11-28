// API 统一响应类型
export interface ApiResponse<T> {
  code: string;
  message: string;
  data: T;
}

// 员工接口
export interface Employee {
  id: number;
  emp_no: string; // 职工号
  department: string;
  name: string;
  gender: string; // 性别
  position: string; // 职务
  title: string; // 职称
  base_salary: number; // 基本工资
  join_date: string; // 入职日期 ISO 格式
  is_active: boolean; // 在职状态
  created_at?: string;
  updated_at?: string;
}

// 薪资记录接口
export interface SalaryRecord {
  id: number;
  employee_id: number;
  employee: Employee;
  year: number;
  month: number;
  // 收入项
  base_salary: number; // 基本工资
  work_age_salary: number; // 工龄工资
  position_allowance: number; // 职务津贴
  transport_allowance: number; // 交通补贴
  meal_allowance: number; // 餐补
  housing_allowance: number; // 住房补贴
  // 扣款项
  sick_leave_deduction: number; // 病事假扣款
  // 税费社保
  income_tax: number; // 个人所得税
  housing_fund: number; // 住房公积金
  pension: number; // 养老保险
  medical_insurance: number; // 医疗保险
  unemployment: number; // 失业保险
  // 计算字段（后端返回）
  gross?: number; // 应发
  net?: number; // 实发
  created_at?: string;
  updated_at?: string;
}

// 薪资记录响应（包含计算字段）
export interface SalaryRecordWithCalc {
  salary: SalaryRecord;
  gross: number; // 应发
  net: number; // 实发
}

// 员工调动请求
export interface TransferRequest {
  new_department?: string;
  new_position?: string;
  new_title?: string;
  is_active?: boolean;
}

// 职工调动记录（前端展示用）
export interface TransferRecord {
  id: number;
  employeeId: number;
  type: "调入" | "调出" | "部门变更" | "职位变更" | "离职";
  fromDepartment?: string;
  toDepartment?: string;
  fromPosition?: string;
  toPosition?: string;
  transferDate: string;
  reason?: string;
  remark?: string;
}

export interface LoginResponse {
  token: string;
}

// 分页参数（使用 limit/offset）
export interface PaginationParams {
  limit?: number; // 每页数量，默认 100
  offset?: number; // 偏移量，默认 0
}

// 分页响应（兼容旧格式）
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page?: number;
  pageSize?: number;
  totalPages?: number;
}

// 部门统计
export interface DeptStats {
  department: string;
  total_gross: number; // 应发总额
  total_net: number; // 实发总额
  count: number; // 人数
}

// 整体汇总统计
export interface SummaryStats {
  total_gross: number; // 应发总额
  total_net: number; // 实发总额
  count: number; // 人数
}
