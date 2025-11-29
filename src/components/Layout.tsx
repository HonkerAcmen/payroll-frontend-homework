import React, { PropsWithChildren } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { removeToken } from "@/lib/auth";

export default function Layout({ children }: PropsWithChildren) {
  const router = useRouter();
  const currentPath = router.pathname;

  const handleLogout = () => {
    if (confirm("确定要退出登录吗？")) {
      removeToken();
      router.push("/login");
    }
  };

  const navLinks = [
    { href: "/employees", label: "员工管理" },
    { href: "/salaries", label: "工资管理" },
    { href: "/salary/search", label: "工资筛选" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                <span className="text-lg font-bold text-white">员</span>
              </div>
              <span className="text-xl font-bold text-gray-800">
                员工管理系统
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <nav className="hidden items-center gap-1 md:flex">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      currentPath === link.href ||
                      currentPath.startsWith(link.href + "/")
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <button
                onClick={handleLogout}
                className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} 员工管理系统. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
