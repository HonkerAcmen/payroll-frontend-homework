import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./client";
import {
  Employee,
  SalaryRecord,
  SalaryRecordWithCalc,
  LoginResponse,
  TransferRequest,
  DeptStats,
  SummaryStats,
} from "@/types/api";

export const useLogin = () =>
  useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const res = await api.post<LoginResponse>("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      return { token: res.data.token };
    },
  });

export const useEmployees = (params?: {
  department: string;
  limit: string;
  offset: string;
}) => {
  return useQuery({
    queryKey: ["employees", params],
    queryFn: async () => {
      // 后端接口：GET /api/employees?department=&limit=&offset=
      const queryParams: Record<string, string> = {};
      if (params?.department) queryParams.department = params.department;
      if (params?.limit) queryParams.limit = params.limit;
      if (params?.offset !== undefined) queryParams.offset = params.offset;

      const res = await api.get<Employee[]>("/employees", {
        params: queryParams,
      });
      return res.data;
    },
  });
};

export const useCreateEmployee = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Employee>) => {
      // 后端接口：POST /api/employees
      const res = await api.post<Employee>("/employees", data);
      return res.data;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

export const useEmployee = (id: number) =>
  useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      // 后端接口：GET /api/employees/:id
      const res = await api.get<Employee>(`/employees/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

export const useUpdateEmployee = () => {
  const client = useQueryClient();
  return useMutation({
    // Partial将泛型 T 中所有的属性都变成「可选属性」
    mutationFn: async ({ id, ...data }: Partial<Employee> & { id: number }) => {
      // 后端接口：PUT /api/employees/:id
      const res = await api.put<Employee>(`/employees/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      // 同时更新employees和employee
      client.invalidateQueries({ queryKey: ["employees"] });
      client.invalidateQueries({ queryKey: ["employee"] });
    },
  });
};

export const useDeleteEmployee = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      // 后端接口：DELETE /api/employees/:id (返回 204)
      await api.delete(`/employees/${id}`);
      return {};
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

// 为员工创建薪资记录
export const useCreateEmployeeSalary = (employeeId: number) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<SalaryRecord>) => {
      // 后端接口：POST /api/employees/:id/salaries
      const res = await api.post<SalaryRecord>(
        `/employees/${employeeId}/salaries`,
        data
      );
      return res.data;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["salary", employeeId] });
      client.invalidateQueries({ queryKey: ["salaries"] });
    },
  });
};

// 注意：创建薪资记录应该使用 useCreateEmployeeSalary，这里保留用于兼容
export const useCreateSalary = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (
      data: Partial<SalaryRecord> & { employee_id: number }
    ) => {
      // 应该使用 POST /api/employees/:id/salaries
      const res = await api.post<SalaryRecord>(
        `/employees/${data.employee_id}/salaries`,
        data
      );
      return res.data;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["salaries"] });
      client.invalidateQueries({ queryKey: ["salary"] });
    },
  });
};

// 员工调动
export const useTransferEmployee = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: TransferRequest & { id: number }) => {
      // 后端接口：POST /api/employees/:id/transfer
      const res = await api.post<{ message: string; employee: Employee }>(
        `/employees/${id}/transfer`,
        data
      );
      return res.data.employee;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["employees"] });
      client.invalidateQueries({ queryKey: ["employee"] });
    },
  });
};

// 获取员工薪资记录列表
export const useSalaryRecords = (employeeId: number) =>
  useQuery({
    queryKey: ["salary", employeeId],
    queryFn: async () => {
      // 后端接口：GET /api/employees/:id/salaries
      const res = await api.get<SalaryRecord[]>(
        `/employees/${employeeId}/salaries`
      );
      return res.data;
    },
    enabled: !!employeeId,
  });

// 注意：后端没有单独的调动记录查询接口，需要从员工历史记录中获取
// 这里保留用于前端展示，实际数据需要从员工更新历史中提取
export const useTransferRecords = (employeeId: number) =>
  useQuery({
    queryKey: ["transfer", employeeId],
    queryFn: async () => {
      // 后端没有此接口，返回空数组
      return [];
    },
    enabled: !!employeeId,
  });

// 获取单个薪资记录
export const useSalary = (id: number) =>
  useQuery({
    queryKey: ["salary", id],
    queryFn: async () => {
      // 后端接口：GET /api/salaries/:id
      const res = await api.get<SalaryRecordWithCalc>(`/salaries/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

// 查询薪资记录
export const useSalaries = (params?: {
  year?: number;
  month?: number;
  department?: string;
}) => {
  return useQuery({
    queryKey: ["salaries", params],
    queryFn: async () => {
      // 后端接口：GET /api/salaries?year=&month=&department=
      const res = await api.get<SalaryRecordWithCalc[]>("/salaries", {
        params,
      });
      return res.data;
    },
  });
};

export const useUpdateSalary = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: Partial<SalaryRecord> & { id: number }) => {
      // 后端接口：PUT /api/salaries/:id
      const res = await api.put<SalaryRecord>(`/salaries/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["salaries"] });
      client.invalidateQueries({ queryKey: ["salary"] });
    },
  });
};

export const useDeleteSalary = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      // 后端接口：DELETE /api/salaries/:id (返回 204)
      await api.delete(`/salaries/${id}`);
      return {};
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["salaries"] });
      client.invalidateQueries({ queryKey: ["salary"] });
    },
  });
};

// 跨员工工资查询（使用 /api/salaries 接口，前端过滤）
export const useSearchSalaries = (params?: {
  year?: string;
  month?: string;
  department?: string;
}) => {
  return useQuery({
    queryKey: ["searchSalaries", params],
    queryFn: async () => {
      // 使用 /api/salaries 接口，支持 year/month/department 筛选
      const res = await api.get<SalaryRecordWithCalc[]>("/salaries", {
        params,
      });
      return res.data;
    },
  });
};

// 部门统计
export const useDeptStats = (year: number, month: number) => {
  return useQuery({
    queryKey: ["deptStats", year, month],
    queryFn: async () => {
      // 后端接口：GET /api/stats/dept?year=&month=
      const res = await api.get<DeptStats[]>("/stats/dept", {
        params: { year, month },
      });
      return res.data;
    },
    enabled: !!year && !!month,
  });
};

// 整体汇总统计
export const useSummaryStats = (year: number, month: number) => {
  return useQuery({
    queryKey: ["summaryStats", year, month],
    queryFn: async () => {
      // 后端接口：GET /api/stats/summary?year=&month=
      const res = await api.get<SummaryStats>("/stats/summary", {
        params: { year, month },
      });
      return res.data;
    },
    enabled: !!year && !!month,
  });
};

// 导出 CSV
export const useExportCSV = () => {
  return useMutation({
    mutationFn: async ({ year, month }: { year: number; month: number }) => {
      // 后端接口：GET /api/export?year=&month=
      const res = await api.get<Blob>("/export", {
        params: { year, month },
        responseType: "blob",
      });

      // 创建下载链接
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `工资记录_${year}_${month}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return res.data;
    },
  });
};
