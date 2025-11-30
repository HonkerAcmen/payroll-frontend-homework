# 员工工资管理系统

一个基于 Next.js 和 React 开发的现代化员工工资管理系统，提供完整的员工管理、工资管理、统计分析和数据可视化功能。

## 📋 项目简介

本系统是一个全栈的工资管理系统，前端采用 Next.js 16 + React 19 + TypeScript 构建，UI 使用 Ant Design 组件库，数据可视化使用 ECharts。系统提供了完整的员工信息管理、工资记录管理、数据统计分析和报表导出等功能。

## ✨ 主要功能

### 1. 员工管理

- ✅ 员工信息的增删改查
- ✅ 员工详情查看（包含工资记录和调动记录）
- ✅ 员工调动功能（部门、职位、职称变更）
- ✅ 按部门和姓名搜索员工
- ✅ 分页显示员工列表

### 2. 工资管理

- ✅ 工资记录的创建、编辑、删除
- ✅ 按年月和部门筛选工资记录
- ✅ 工资表单自动计算应发和实发工资
- ✅ 基本工资自动从员工信息读取
- ✅ 支持完整的工资项管理（基本工资、工龄工资、各种津贴、扣款、税费等）

### 3. 工资筛选

- ✅ 跨员工工资记录查询
- ✅ 多条件筛选（姓名、部门、年月）
- ✅ 详细的工资明细展示

### 4. 统计分析

- ✅ 系统概览仪表板
- ✅ 整体统计（员工总数、工资记录数、应发/实发总额）
- ✅ 部门统计（按年月统计各部门工资情况）
- ✅ 数据可视化图表：
  - 部门工资总额对比柱状图
  - 部门人数分布饼图
  - 部门平均工资对比图

### 5. 数据导出

- ✅ CSV 格式导出工资记录
- ✅ 支持筛选后的数据导出
- ✅ 自动添加 BOM，Excel 正确识别中文

### 6. 用户认证

- ✅ JWT Token 认证
- ✅ 自动登录状态检查
- ✅ 登录过期自动跳转

## 🛠️ 技术栈

### 前端框架

- **Next.js 16.0.5** - React 框架，支持 SSR 和静态生成
- **React 19.2.0** - UI 库
- **TypeScript 5** - 类型安全

### UI 组件库

- **Ant Design 6.0.0** - 企业级 UI 组件库
- **Tailwind CSS 4** - 实用优先的 CSS 框架

### 数据管理

- **@tanstack/react-query 5.90.11** - 强大的数据同步和状态管理
- **Axios 1.13.2** - HTTP 客户端

### 数据可视化

- **ECharts 6.0.0** - 强大的数据可视化库
- **echarts-for-react 3.0.5** - ECharts 的 React 封装

### 工具库

- **dayjs 1.11.19** - 轻量级日期处理库
- **react-icons 5.5.0** - 图标库

## 📁 项目结构

```
payroll-frontend-homework/
├── src/
│   ├── api/                    # API 相关
│   │   ├── client.ts           # Axios 客户端配置
│   │   └── hooks.ts            # React Query Hooks
│   ├── components/             # 通用组件
│   │   └── Modal.tsx
│   ├── constants/              # 常量定义
│   │   └── index.ts
│   ├── lib/                    # 工具库
│   │   └── auth.ts             # 认证工具函数
│   ├── pages/                  # 页面组件
│   │   ├── _app.tsx            # 应用入口
│   │   ├── _components/         # 页面级组件
│   │   │   ├── Layout.tsx      # 布局组件
│   │   │   ├── DeptSalaryChart.tsx      # 部门工资图表
│   │   │   ├── DeptCountPieChart.tsx   # 部门人数饼图
│   │   │   └── SalaryComparisonChart.tsx # 工资对比图
│   │   ├── index.tsx           # 首页（系统概览）
│   │   ├── login.tsx           # 登录页
│   │   ├── employees/          # 员工管理
│   │   │   ├── index.tsx       # 员工列表
│   │   │   ├── [id].tsx        # 员工详情
│   │   │   └── _components/    # 员工相关组件
│   │   │       ├── EmployeeForm.tsx
│   │   │       ├── Form.tsx
│   │   │       └── TransferForm.tsx
│   │   ├── salaries/           # 工资管理
│   │   │   ├── index.tsx       # 工资列表
│   │   │   └── _components/
│   │   │       └── SalaryForm.tsx
│   │   └── salary/             # 工资筛选
│   │       └── search.tsx
│   ├── styles/                 # 样式文件
│   │   └── globals.css
│   ├── types/                  # TypeScript 类型定义
│   │   └── api.ts
│   └── utils/                  # 工具函数
│       ├── csvExport.ts        # CSV 导出工具
│       └── dateFormat.ts       # 日期格式化工具
├── public/                     # 静态资源
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- pnpm >= 8.0.0 (推荐) 或 npm/yarn

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 配置后端 API

编辑 `src/api/client.ts`，修改后端 API 地址：

```typescript
export const api = axios.create({
  baseURL: "http://localhost:8080/api", // 修改为你的后端地址
  timeout: 8000,
});
```

### 启动开发服务器

```bash
# 使用 pnpm
pnpm dev

# 或使用 npm
npm run dev

# 或使用 yarn
yarn dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
pnpm build
pnpm start
```

## 📖 使用说明

### 登录系统

1. 访问系统首页，未登录会自动跳转到登录页
2. 输入用户名和密码登录
3. 登录成功后跳转到系统概览页面

### 员工管理

1. **查看员工列表**：点击侧边栏"员工管理"
2. **添加员工**：点击"新增员工"按钮，填写员工信息
3. **查看员工详情**：点击"查看详情"按钮
4. **编辑员工**：在员工详情页点击"编辑信息"
5. **员工调动**：在员工详情页点击"员工调动"
6. **删除员工**：在员工列表点击"删除"按钮

### 工资管理

1. **查看工资记录**：点击侧边栏"工资管理"
2. **添加工资记录**：
   - 点击"新增工资记录"
   - 选择员工（基本工资会自动填充）
   - 填写年份、月份和其他工资项
   - 提交保存
3. **编辑工资记录**：点击表格中的"编辑"按钮
4. **删除工资记录**：点击表格中的"删除"按钮
5. **筛选工资记录**：使用年份、月份、部门筛选器
6. **导出 CSV**：点击"导出 CSV"按钮

### 工资筛选

1. 点击侧边栏"工资筛选"
2. 使用搜索框和筛选器进行多条件查询
3. 查看筛选结果
4. 导出筛选后的数据

### 系统概览

1. 首页显示系统统计信息
2. 选择年份和月份查看对应时期的统计数据
3. 查看可视化图表：
   - 部门工资总额对比
   - 部门人数分布
   - 部门平均工资对比

## 🔧 核心功能实现

### 数据获取

使用 React Query 进行数据管理：

```typescript
const { data, isLoading, error } = useEmployees();
```

### 表单处理

使用 Ant Design Form 组件：

```typescript
const [form] = Form.useForm();
form.setFieldsValue({ ...data });
```

### 日期格式化

统一的日期格式化工具：

```typescript
import { formatDate } from "@/utils/dateFormat";
formatDate(dateString); // 返回 "yyyy-mm-dd"
```

### CSV 导出

使用统一的导出工具：

```typescript
import { exportToCSV } from "@/utils/csvExport";
exportToCSV({
  filename: "工资记录.csv",
  headers: ["列1", "列2"],
  rows: [[...], [...]]
});
```

## 📊 API 接口说明

### 认证接口

- `POST /api/auth/login` - 用户登录

### 员工接口

- `GET /api/employees` - 获取员工列表
- `GET /api/employees/:id` - 获取员工详情
- `POST /api/employees` - 创建员工
- `PUT /api/employees/:id` - 更新员工
- `DELETE /api/employees/:id` - 删除员工
- `POST /api/employees/:id/transfer` - 员工调动

### 工资接口

- `GET /api/salaries` - 获取工资记录列表
- `GET /api/salaries/:id` - 获取工资记录详情
- `POST /api/employees/:id/salaries` - 创建工资记录
- `PUT /api/salaries/:id` - 更新工资记录
- `DELETE /api/salaries/:id` - 删除工资记录
- `GET /api/employees/:id/salaries` - 获取员工工资记录

### 统计接口

- `GET /api/stats/summary?year=&month=` - 获取汇总统计
- `GET /api/stats/dept?year=&month=` - 获取部门统计

## 🎨 UI/UX 特性

- ✅ 响应式设计，支持移动端和桌面端
- ✅ 现代化的界面设计
- ✅ 友好的错误提示
- ✅ 加载状态提示
- ✅ 空数据提示
- ✅ 数据可视化图表
- ✅ 统一的颜色主题

## 🔒 安全特性

- JWT Token 认证
- 自动 Token 注入请求头
- 401 错误自动跳转登录
- 登录状态持久化

## 📝 开发规范

### 代码风格

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码

### 组件规范

- 使用函数式组件
- 使用 Hooks 管理状态
- 组件按功能模块组织

### 命名规范

- 组件文件使用 PascalCase
- 工具函数使用 camelCase
- 常量使用 UPPER_SNAKE_CASE

## 🐛 已知问题

- 调动记录功能需要后端支持（当前返回空数组）
- 部分统计功能需要后端接口支持

## 🔮 未来计划

- [ ] 添加权限管理
- [ ] 添加数据导入功能
- [ ] 添加更多统计图表
- [ ] 添加工资条打印功能
- [ ] 添加消息通知功能
- [ ] 优化移动端体验

## 📄 许可证

本项目为作业项目，仅供学习使用。

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题，请提交 Issue 或联系项目维护者。

---

**注意**：本项目需要后端 API 支持，请确保后端服务正常运行并配置正确的 API 地址。
