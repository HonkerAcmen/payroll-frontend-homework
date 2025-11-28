import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "../components/Layout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { isAuthenticated } from "@/lib/auth";

export default function App({ Component, pageProps }: AppProps) {
  const [qc] = useState(() => new QueryClient());
  const router = useRouter();
  const isLoginPage = router.pathname === "/login";

  useEffect(() => {
    // 未登录访问页面时自动跳转到 /login（登录页除外）
    if (!isLoginPage && !isAuthenticated()) {
      router.push("/login");
    }
    // 已登录访问登录页时跳转到员工页面
    if (isLoginPage && isAuthenticated()) {
      router.push("/employees");
    }
  }, [router.pathname, isLoginPage]);

  return (
    <QueryClientProvider client={qc}>
      {isLoginPage ? (
        <Component {...pageProps} />
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </QueryClientProvider>
  );
}
