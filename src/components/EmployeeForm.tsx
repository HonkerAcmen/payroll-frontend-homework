import { useState, useEffect } from 'react';
import { Employee } from '@/types/api';

interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (data: Partial<Employee>) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function EmployeeForm({ employee, onSubmit, onCancel, isLoading }: EmployeeFormProps) {
  const [form, setForm] = useState<Partial<Employee>>({
    name: '',
    department: '',
    position: '',
    salary: 0,
    hireDate: '',
  });

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name || '',
        department: employee.department || '',
        position: employee.position || '',
        salary: employee.salary || 0,
        hireDate: employee.hireDate || '',
      });
    }
  }, [employee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          姓名 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="请输入员工姓名"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          部门 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
          placeholder="请输入部门名称"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          职位 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
          placeholder="请输入职位"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          薪资 <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          required
          min="0"
          step="0.01"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={form.salary}
          onChange={(e) => setForm({ ...form, salary: Number(e.target.value) })}
          placeholder="请输入薪资"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          入职日期 <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={form.hireDate}
          onChange={(e) => setForm({ ...form, hireDate: e.target.value })}
        />
      </div>

      <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 transition-colors"
          disabled={isLoading}
        >
          取消
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              提交中...
            </span>
          ) : employee ? (
            '更新'
          ) : (
            '创建'
          )}
        </button>
      </div>
    </form>
  );
}

