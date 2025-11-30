import { useState } from "react";
import { useLogin } from "@/api/hooks";
import { useRouter } from "next/router";
import { AiFillThunderbolt } from "react-icons/ai";

export default function Login() {
  const router = useRouter();
  const login = useLogin();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const submit = async () => {
    try {
      setError("");
      await login.mutateAsync(form);
      router.push("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "登录失败，请检查用户名和密码");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      submit();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <AiFillThunderbolt size={100} className="text-white" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-800">
            员工管理系统
          </h1>
          <p className="text-sm text-gray-500">欢迎登录</p>
        </div>

        {error && (
          <div className="animate-shake mb-4 rounded border-l-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              用户名
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="请输入用户名"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              onKeyPress={handleKeyPress}
              disabled={login.isPending}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              密码
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="请输入密码"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyPress={handleKeyPress}
              disabled={login.isPending}
            />
          </div>

          <button
            onClick={submit}
            disabled={login.isPending || !form.username || !form.password}
            className="w-full transform rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 py-3 font-medium text-white shadow-lg transition-all hover:-translate-y-0.5 hover:from-blue-600 hover:to-blue-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            {login.isPending ? (
              <span className="flex items-center justify-center">
                <svg
                  className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
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
                登录中...
              </span>
            ) : (
              "登录"
            )}
          </button>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>提示：务必管理好自己的信息，规范输入。注册请联系管理员。</p>
        </div>
      </div>
    </div>
  );
}
