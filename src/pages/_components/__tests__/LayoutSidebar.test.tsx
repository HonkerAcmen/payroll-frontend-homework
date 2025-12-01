import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { removeToken } from "@/lib/auth";
import Layout from "../Layout";

vi.mock("@/lib/auth", () => ({
  removeToken: vi.fn(),
}));

const mockPush = vi.fn();
let mockPathname = "/";

vi.mock("next/router", () => ({
  useRouter: () => ({
    pathname: mockPathname,
    push: mockPush,
  }),
}));

vi.mock("antd", () => {
  const LayoutComponent = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout-root">{children}</div>
  );
  const Sider = ({
    children,
    collapsed,
    onCollapse,
  }: {
    children: React.ReactNode;
    collapsed: boolean;
    onCollapse: (value: boolean) => void;
  }) => (
    <aside data-testid="sider" data-collapsed={collapsed ? "true" : "false"}>
      <button
        type="button"
        data-testid="sider-trigger"
        onClick={() => onCollapse(!collapsed)}
      >
        mock-sider-toggle
      </button>
      {children}
    </aside>
  );
  const Header = ({ children }: { children: React.ReactNode }) => (
    <header data-testid="header">{children}</header>
  );
  const Content = ({ children }: { children: React.ReactNode }) => (
    <section>{children}</section>
  );
  const Footer = ({ children }: { children: React.ReactNode }) => (
    <footer>{children}</footer>
  );
  LayoutComponent.Sider = Sider;
  LayoutComponent.Header = Header;
  LayoutComponent.Content = Content;
  LayoutComponent.Footer = Footer;

  const Menu = ({
    items,
    onClick,
    selectedKeys,
  }: {
    items: { key: string; label: React.ReactNode }[];
    onClick: ({ key }: { key: string }) => void;
    selectedKeys?: string[];
  }) => (
    <nav>
      {items.map((item) => (
        <button
          type="button"
          key={item.key}
          data-testid={`nav-${item.key}`}
          data-active={selectedKeys?.includes(item.key) ? "true" : "false"}
          onClick={() => onClick({ key: item.key })}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );

  const Button = ({
    children,
    onClick,
    icon,
    type,
    ...rest
  }: React.PropsWithChildren<{
    onClick?: () => void;
    icon?: React.ReactNode;
    type?: string;
  }>) => (
    <button
      type="button"
      aria-label={(rest as { ["aria-label"]?: string })["aria-label"]}
      data-variant={type}
      onClick={onClick}
    >
      {icon}
      {children}
    </button>
  );

  const Popconfirm = ({
    children,
    onConfirm,
  }: {
    children: React.ReactElement<{ onClick?: () => void }>;
    onConfirm?: () => void;
  }) =>
    React.cloneElement(children, {
      onClick: onConfirm,
    });

  return {
    Layout: LayoutComponent,
    Menu,
    Button,
    Popconfirm,
  };
});

const mockedRemoveToken = vi.mocked(removeToken);

const renderLayout = () =>
  render(
    <Layout>
      <div>content</div>
    </Layout>
  );

describe("Layout sidebar behavior", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    mockPush.mockClear();
    mockedRemoveToken.mockClear();
    mockPathname = "/";
  });

  it("渲染所有侧边栏入口并高亮当前路由", () => {
    mockPathname = "/employees";
    renderLayout();

    expect(screen.getByTestId("nav-/")).toBeInTheDocument();
    expect(screen.getByTestId("nav-/employees")).toHaveAttribute(
      "data-active",
      "true"
    );
  });

  it("点击菜单项会跳转对应路由", async () => {
    renderLayout();

    await user.click(screen.getByTestId("nav-/salaries"));

    expect(mockPush).toHaveBeenCalledWith("/salaries");
  });

  it("点击 LOGO 会返回首页", async () => {
    renderLayout();

    await user.click(screen.getByTestId("sidebar-logo"));

    expect(mockPush).toHaveBeenCalledWith("/");
  });

  it("顶部按钮可以折叠 / 展开侧边栏", async () => {
    renderLayout();
    const sider = screen.getByTestId("sider");

    expect(sider).toHaveAttribute("data-collapsed", "false");

    const toggleBtn = screen.getByRole("button", { name: "toggle-sider" });
    await user.click(toggleBtn);

    expect(sider).toHaveAttribute("data-collapsed", "true");
  });

  it("Sider 自身的折叠控制同样生效", async () => {
    renderLayout();
    const sider = screen.getByTestId("sider");

    await user.click(screen.getByTestId("sider-trigger"));

    expect(sider).toHaveAttribute("data-collapsed", "true");
  });

  it("确认退出后会清理 token 并跳转登录页", async () => {
    renderLayout();

    await user.click(screen.getByText("退出登录"));

    expect(mockedRemoveToken).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
