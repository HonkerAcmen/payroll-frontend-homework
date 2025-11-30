import React, { PropsWithChildren, useState } from "react";
import { useRouter } from "next/router";
import { Layout as AntLayout, Menu, Button, Popconfirm } from "antd";
import {
  AiOutlineUser,
  AiOutlineDollar,
  AiOutlineSearch,
  AiOutlineLogout,
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
} from "react-icons/ai";
import { removeToken } from "@/lib/auth";

const { Header, Sider, Content, Footer } = AntLayout;

export default function Layout({ children }: PropsWithChildren) {
  const router = useRouter();
  const currentPath = router.pathname;
  const [collapsed, setCollapsed] = useState(false);

  const navLinks = [
    { key: "/employees", label: "员工管理", icon: <AiOutlineUser /> },
    { key: "/salaries", label: "工资管理", icon: <AiOutlineDollar /> },
    { key: "/salary/search", label: "工资筛选", icon: <AiOutlineSearch /> },
  ];

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  return (
    <AntLayout style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      {/* 侧边栏 */}
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{ background: "#fff" }}
        className="border-r border-gray-200"
      >
        <div
          className={`flex h-16 items-center justify-center font-bold text-gray-800 text-lg cursor-pointer ${
            collapsed ? "text-xl" : ""
          }`}
          onClick={() => router.push("/")}
        >
          {collapsed ? "员" : "员工管理"}
        </div>
        <Menu
          mode="inline"
          selectedKeys={[currentPath]}
          onClick={({ key }) => router.push(key)}
          items={navLinks.map((link) => ({
            key: link.key,
            icon: link.icon,
            label: link.label,
          }))}
        />
      </Sider>

      <AntLayout style={{ background: "#f0f2f5" }}>
        {/* 顶部 Header */}
        <Header
          className="flex items-center justify-between px-4"
          style={{ background: "#ffffff", borderBottom: "1px solid #e8e8e8" }}
        >
          <Button
            type="text"
            onClick={() => setCollapsed(!collapsed)}
            icon={collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
          />

          <Popconfirm
            title="退出登录"
            description="确定要退出吗?"
            onConfirm={handleLogout}
            okText="是"
            cancelText="否"
          >
            <Button type="primary" danger icon={<AiOutlineLogout />}>
              退出登录
            </Button>
          </Popconfirm>
        </Header>

        {/* 内容区域 */}
        <Content className=" bg-white p-6 shadow-sm">{children}</Content>

        {/* 底部 Footer */}
        <Footer
          className="text-center text-gray-500"
          style={{ background: "#f0f2f5" }}
        >
          © {new Date().getFullYear()} 员工管理系统. All rights reserved.
        </Footer>
      </AntLayout>
    </AntLayout>
  );
}
