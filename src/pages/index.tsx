import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">欢迎使用 HR 管理系统</h1>
        <p className="text-gray-600 mb-8">请选择功能模块</p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/employees"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            员工管理
          </Link>
        </div>
      </div>
    </div>
  );
}
