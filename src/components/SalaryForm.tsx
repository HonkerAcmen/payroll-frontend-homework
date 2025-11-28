import { useState, useEffect } from 'react';
import { SalaryRecord } from '@/types/api';

interface SalaryFormProps {
  salary?: SalaryRecord;
  onSubmit: (data: Partial<SalaryRecord>) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function SalaryForm({ salary, onSubmit, onCancel, isLoading }: SalaryFormProps) {
  const [form, setForm] = useState<Partial<SalaryRecord>>({
    employeeId: 0,
    month: '',
    baseSalary: 0,
    bonus: 0,
    deduction: 0,
  });

  useEffect(() => {
    if (salary) {
      setForm({
        employeeId: salary.employeeId,
        month: salary.month,
        baseSalary: salary.baseSalary,
        bonus: salary.bonus,
        deduction: salary.deduction,
      });
    }
  }, [salary]);

  // 自动计算合计
  const total = (form.baseSalary || 0) + (form.bonus || 0) - (form.deduction || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...form, total });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          员工ID <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          required
          min="1"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={form.employeeId}
          onChange={(e) => setForm({ ...form, employeeId: Number(e.target.value) })}
          placeholder="请输入员工ID"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          月份 <span className="text-red-500">*</span> (格式: YYYY-MM)
        </label>
        <input
          type="text"
          required
          pattern="\d{4}-\d{2}"
          placeholder="2024-01"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={form.month}
          onChange={(e) => setForm({ ...form, month: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          基本工资 <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          required
          min="0"
          step="0.01"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={form.baseSalary}
          onChange={(e) => setForm({ ...form, baseSalary: Number(e.target.value) })}
          placeholder="请输入基本工资"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">奖金</label>
        <input
          type="number"
          min="0"
          step="0.01"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={form.bonus || 0}
          onChange={(e) => setForm({ ...form, bonus: Number(e.target.value) })}
          placeholder="请输入奖金"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">扣款</label>
        <input
          type="number"
          min="0"
          step="0.01"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={form.deduction || 0}
          onChange={(e) => setForm({ ...form, deduction: Number(e.target.value) })}
          placeholder="请输入扣款"
        />
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          合计（自动计算）
        </label>
        <p className="text-2xl font-bold text-blue-600">¥{total.toFixed(2)}</p>
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
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              提交中...
            </span>
          ) : salary ? (
            "更新"
          ) : (
            "创建"
          )}
        </button>
      </div>
    </form>
  );
}

