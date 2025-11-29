# FureverHome-FrontEnd

**宠物领养平台前端项目** - 基于 Vue 3 + TypeScript + Vite 构建的现代化宠物领养平台前端应用

## 📋 项目概述

FureverHome 是一个专为宠物领养设计的现代化 Web 平台，旨在连接宠物救助机构、志愿者和潜在的宠物领养者。本项目为前端部分，提供直观友好的用户界面和流畅的用户体验。

## 🏗️ 项目结构

```
FureverHome-FrontEnd/
├── .gitignore                    # Git忽略文件配置
├── LICENSE                       # 项目许可证文件
├── README.md                     # 项目说明文档（当前文件）
└── furever_home_v1/              # 主项目目录
    ├── .editorconfig             # 编辑器配置文件
    ├── .eslintcache              # ESLint缓存文件
    ├── .prettierrc.json          # Prettier代码格式化配置
    ├── README.md                 # 子项目说明文档
    ├── env.d.ts                  # TypeScript环境声明文件
    ├── eslint.config.ts          # ESLint配置文件
    ├── index.html                # 主入口HTML文件
    ├── home1.html                # 备用首页HTML文件
    ├── PetDetail.html            # 宠物详情页面（静态版本）
    ├── node_modules/             # Node.js依赖包目录
    ├── package-lock.json         # 项目依赖锁定文件
    ├── package.json              # 项目配置和依赖声明文件
    ├── postcss.config.cjs        # PostCSS配置文件（CommonJS）
    ├── postcss.config.ts         # PostCSS配置文件（TypeScript）
    ├── public/                   # 公共资源目录
    ├── src/                      # 源代码目录（详见下方）
    ├── tailwind.config.ts        # Tailwind CSS配置文件
    ├── tsconfig.app.json         # TypeScript应用配置
    ├── tsconfig.json             # 主TypeScript配置
    ├── tsconfig.node.json        # Node.js环境TypeScript配置
    └── vite.config.ts            # Vite构建工具配置
```

### 📁 源代码目录结构 (src/)

```
src/
├── App.vue                       # 应用主组件
├── main.ts                       # 应用入口文件
├── api/                          # API接口层
│   ├── index.ts                  # API模块入口文件
│   ├── request.ts                # HTTP请求工具（封装fetch）
│   ├── applyApi.ts               # 申请相关API接口
│   ├── evaluationApi.ts          # 评价相关API接口
│   ├── petApi.ts                 # 宠物相关API接口
│   ├── postApi.ts                # 帖子相关API接口
│   └── userApi.ts                # 用户相关API接口
├── assets/                       # 静态资源
│   ├── icons/
│   │   └── logo.svg              # 项目Logo图标
│   └── styles/
│       ├── base.css              # 基础样式定义
│       └── main.css              # 主要样式文件
├── components/                   # Vue组件
│   ├── PostPet_components/       # 发布宠物相关组件
│   │   ├── LeaveDraftConfirmModal.vue  # 离开草稿确认弹窗
│   │   └── SubmitSuccessModal.vue      # 提交成功弹窗
│   └── common/                   # 通用组件
│       ├── Footer.vue            # 页脚组件
│       ├── NavBar.vue            # 导航栏组件
│       ├── PetCard.vue           # 宠物卡片组件
│       └── PostCard.vue          # 帖子卡片组件
├── data/                         # 数据文件
│   └── pets.ts                   # 宠物数据定义
├── router/                       # 路由配置
│   └── index.ts                  # 路由配置入口文件
├── stores/                       # 状态管理（Pinia）
│   └── counter.ts                # 计数器状态管理示例
├── utils/                        # 工具函数
│   ├── format.ts                 # 数据格式化工具
│   ├── injectAssets.ts           # 资源注入工具
│   ├── storage.ts                # 本地存储工具
│   └── validate.ts               # 数据验证工具
└── views/                        # 页面视图组件
    ├── error/                    # 错误页面
    │   └── 404.vue               # 404错误页面
    ├── forum/                    # 论坛模块
    │   ├── PostDetail.vue        # 帖子详情页面
    │   └── PostList.vue          # 帖子列表页面
    ├── home/                     # 首页模块
    │   └── Home.vue              # 首页组件
    ├── pet/                      # 宠物模块
    │   ├── PetDetail.vue         # 宠物详情页面
    │   ├── PetList.vue           # 宠物列表页面
    │   └── PostPet.vue           # 发布宠物页面
    ├── talk/                     # 交流模块
    │   └── Talk.vue              # 交流页面组件
    └── user/                     # 用户模块
        ├── Login.vue             # 登录页面
        ├── Profile.vue           # 用户个人资料页面（他人视角）
        ├── Profile_backup.vue    # 用户资料页面备份
        ├── Register.vue          # 注册页面
        ├── UserCenter.vue        # 用户中心主页面
        └── UserCenter/           # 用户中心子模块
            ├── BasicInfo.vue     # 基本信息管理
            ├── CreditScore.vue   # 信誉积分查看
            ├── MyApplications.vue # 我的申请
            ├── MyHome.vue        # 我的主页
            ├── MyPosts.vue       # 我的帖子
            └── MyTodo.vue        # 我的待办
```

## 🛠️ 技术栈

### 核心框架
- **Vue 3** (v3.5.22) - 渐进式 JavaScript 框架
- **TypeScript** (v5.9.0) - JavaScript 的超集，提供静态类型检查
- **Vite** (v7.1.11) - 下一代前端构建工具

### 状态管理与路由
- **Pinia** (v3.0.3) - Vue 官方推荐的状态管理库
- **Vue Router** (v4.6.3) - Vue.js 官方路由管理器

### 样式与UI
- **Tailwind CSS** (v4.1.17) - 实用优先的 CSS 框架
- **PostCSS** (v8.5.6) - CSS 后处理器
- **Autoprefixer** (v10.4.22) - 自动添加 CSS 前缀
- **Font Awesome** (via CDN) - 图标库，提供丰富的图标支持

### 开发工具
- **ESLint** (v9.37.0) - JavaScript/TypeScript 代码检查工具
- **Prettier** (v3.6.2) - 代码格式化工具
- **Vue DevTools** (v8.0.3) - Vue 开发者工具

### 构建与部署
- **npm-run-all2** (v8.0.4) - 并行运行 npm 脚本
- **jiti** (v2.6.1) - TypeScript 运行时

### HTTP请求
- **原生 Fetch API** - 使用原生fetch进行HTTP请求，无需额外依赖
- **自定义请求封装** - 统一的请求工具类，支持token认证、错误处理、文件上传等

## 🚀 快速开始

### 环境要求

- **Node.js**: ^20.19.0 || >=22.12.0
- **npm**: 建议使用最新版本

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd FureverHome-FrontEnd/furever_home_v1
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```
   
   开发服务器将在 `http://localhost:5173` 启动

### 📜 可用脚本

| 命令 | 描述 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm run preview` | 预览生产构建 |
| `npm run type-check` | TypeScript 类型检查 |
| `npm run lint` | 运行 ESLint 检查并自动修复 |
| `npm run format` | 使用 Prettier 格式化代码 |

## 🎨 项目特性

### 🐾 核心功能
- **宠物浏览**: 浏览可领养的宠物信息，支持筛选和搜索
- **宠物详情**: 查看宠物的详细信息和照片，支持短期/长期领养
- **用户系统**: 
  - 用户注册、登录和个人资料管理
  - 个人主页展示（他人视角）：展示用户信息、评价、领养记录、帖子等
  - 用户中心：个人信息管理、待办事项、申请管理、帖子管理等
- **申请系统**: 完整的宠物领养申请流程，支持申请、审核、处理
- **论坛交流**: 用户交流和经验分享，支持帖子发布、评论、点赞
- **宠物发布**: 发布待领养宠物信息，支持图片上传和详细信息编辑
- **评价系统**: 用户互评机制，支持评分、评论、申诉
- **信誉积分**: 基于评价的信誉积分系统，展示用户信用等级

### 🎯 技术特性
- **响应式设计**: 支持桌面端和移动端，适配各种屏幕尺寸
- **类型安全**: 完整的 TypeScript 类型定义，提供良好的开发体验
- **模块化架构**: 清晰的代码组织结构，API层、组件层、视图层分离
- **现代化构建**: 基于 Vite 的快速构建，支持热模块替换（HMR）
- **RESTful API**: 统一的API接口设计，支持分页、文件上传等功能
- **组件化开发**: 可复用的Vue组件，提高开发效率
- **路由管理**: 基于Vue Router的单页应用路由管理
- **状态管理**: 使用Pinia进行全局状态管理

## 🎨 设计系统

### 主题配置
```typescript
// tailwind.config.ts
colors: { 
  primary: '#FB923C',           // 主色调（橙色）
  'background-light': '#F8FAFC', // 浅色背景
  'background-dark': '#18181B'   // 深色背景
},
fontFamily: { 
  display: ["'Noto Sans SC'", 'sans-serif'] // 中文字体
}
```

### 组件规范
- 使用 Vue 3 Composition API
- 遵循 TypeScript 严格模式
- 采用 Tailwind CSS 实用类优先的样式方案

## 📝 开发规范

### 代码风格
- 使用 **ESLint** 进行代码质量检查
- 使用 **Prettier** 进行代码格式化
- 遵循 **Vue 3** 官方风格指南
- 采用 **TypeScript** 严格模式

### 文件命名
- 组件文件：`PascalCase.vue`
- 工具文件：`camelCase.ts`
- 页面文件：`PascalCase.vue`
- 样式文件：`kebab-case.css`

### Git 提交规范
建议使用语义化提交信息：
- `feat:` 新功能
- `fix:` 修复问题
- `docs:` 文档更新
- `style:` 代码格式调整
- `refactor:` 代码重构
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

## 🔧 配置文件说明

### 核心配置文件

| 文件 | 用途 |
|------|------|
| `vite.config.ts` | Vite 构建工具配置 |
| `tailwind.config.ts` | Tailwind CSS 主题配置 |
| `tsconfig.json` | TypeScript 编译配置 |
| `eslint.config.ts` | ESLint 代码检查配置 |
| `.prettierrc.json` | Prettier 格式化配置 |
| `postcss.config.ts` | PostCSS 处理配置 |

### 环境变量配置

项目支持通过环境变量配置API基础URL：

```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8080/api

# .env.production
VITE_API_BASE_URL=https://api.fureverhome.com/api
```

如果未设置环境变量，默认使用 `http://localhost:8080/api`

## 🚀 部署指南

### 构建生产版本
```bash
npm run build
```

构建完成后，`dist/` 目录包含所有生产环境文件，可直接部署到静态文件服务器。

### 部署选项
- **Netlify**: 支持自动部署
- **Vercel**: 零配置部署
- **GitHub Pages**: 免费静态托管
- **传统服务器**: 上传 `dist/` 目录内容

## 🤝 贡献指南

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目基于 [LICENSE](LICENSE) 文件中的许可证进行分发。

## 📚 API接口说明

### API模块结构

项目采用模块化的API设计，所有API接口统一管理在 `src/api/` 目录下：

- **request.ts**: HTTP请求工具类，封装fetch，提供统一的请求接口
- **userApi.ts**: 用户相关API（用户信息、统计数据、徽章、证明等）
- **evaluationApi.ts**: 评价相关API（获取评价、添加评价、回复评价等）
- **petApi.ts**: 宠物相关API（获取领养宠物列表、宠物详情等）
- **postApi.ts**: 帖子相关API（获取帖子列表、创建/更新/删除帖子等）
- **applyApi.ts**: 申请相关API（创建申请、处理申请、获取申请列表等）

### API使用示例

```typescript
import { getUserInfo, getUserEvaluations, getUserShortTermPets } from '@/api'

// 获取用户信息
const response = await getUserInfo(1)
if (response.code === 200) {
  console.log(response.data)
}

// 获取评价列表（分页）
const evaluations = await getUserEvaluations(1, { page: 1, pageSize: 5 })

// 获取短期领养宠物列表（分页）
const pets = await getUserShortTermPets(1, { page: 1, pageSize: 6 })
```

### 统一响应格式

所有API接口返回统一的响应格式：

```typescript
interface ApiResponse<T> {
  code: number      // 状态码，200表示成功
  message: string   // 响应消息
  data: T          // 响应数据
}
```

## 🆘 常见问题

### Q: 如何解决依赖安装失败？
A: 尝试删除 `node_modules` 和 `package-lock.json`，然后重新运行 `npm install`

### Q: 开发服务器启动失败？
A: 检查 Node.js 版本是否符合要求（^20.19.0 || >=22.12.0）

### Q: 如何添加新的页面？
A: 在 `src/views/` 目录下创建新的 Vue 组件，然后在 `src/router/index.ts` 中添加路由配置

### Q: 如何配置API基础URL？
A: 创建 `.env.development` 或 `.env.production` 文件，设置 `VITE_API_BASE_URL` 环境变量

### Q: 如何添加新的API接口？
A: 在对应的API文件中添加新的函数（如 `userApi.ts`），使用 `httpClient` 发送请求

### Q: 如何处理API请求错误？
A: 所有API请求都会抛出错误，可以使用 try-catch 捕获，或使用全局错误处理中间件

---

**🐾 让每个宠物都能找到温暖的家！**
