# FureverHome-FrontEnd
软工作业宠物领养平台的前端仓库

# FureverHome-FrontEnd 项目说明

## 项目结构树

```
FureverHome-FrontEnd/
├── .gitignore                # Git忽略文件配置
├── LICENSE                   # 项目许可证文件
├── README.md                 # 项目说明文档（当前文件）
└── furever_home_v1/          # 主项目目录
    ├── .editorconfig         # 编辑器配置文件
    ├── .eslintcache          # ESLint缓存文件
    ├── .prettierrc.json      # Prettier代码格式化配置
    ├── README.md             # 子项目说明文档
    ├── dist/                 # 构建输出目录
    │   ├── assets/           # 静态资源文件
    │   ├── favicon.ico       # 网站图标
    │   └── index.html        # 构建后的主HTML文件
    ├── env.d.ts              # TypeScript环境声明文件
    ├── eslint.config.ts      # ESLint配置文件
    ├── home1.html            # 备用首页HTML文件
    ├── index.html            # 主入口HTML文件
    ├── node_modules/         # Node.js依赖包目录
    ├── package-lock.json     # 项目依赖锁定文件
    ├── package.json          # 项目配置和依赖声明文件
    ├── postcss.config.ts     # PostCSS配置文件
    ├── profile.html          # 用户个人资料页面
    ├── public/               # 公共资源目录
    ├── src/                  # 源代码目录
    ├── tailwind.config.ts    # Tailwind CSS配置文件
    ├── tsconfig.app.json     # TypeScript应用配置
    ├── tsconfig.json         # 主TypeScript配置
    ├── tsconfig.node.json    # Node.js环境TypeScript配置
    └── vite.config.ts        # Vite构建工具配置
```

## 文件和文件夹说明

### 根目录 (FureverHome-FrontEnd/)

- **.gitignore**: Git版本控制忽略文件列表，指定哪些文件和目录不应被Git跟踪。
- **LICENSE**: 项目许可证文件，定义了项目的使用、修改和分发规则。
- **README.md**: 项目说明文档，提供项目概述、安装说明和使用指南。

### 主项目目录 (furever_home_v1/)

#### 配置文件

- **.editorconfig**: 编辑器配置文件，确保团队成员在不同编辑器中保持一致的代码风格。
- **.eslintcache**: ESLint缓存文件，提高ESLint检查性能。
- **.prettierrc.json**: Prettier配置文件，定义代码格式化规则。
- **env.d.ts**: TypeScript环境声明文件，为TypeScript编译器提供类型定义。
- **eslint.config.ts**: ESLint配置文件，定义代码质量检查规则。
- **postcss.config.ts**: PostCSS配置文件，用于处理CSS的后处理器配置。
- **tailwind.config.ts**: Tailwind CSS配置文件，自定义Tailwind主题和配置。
- **tsconfig.json**: 主TypeScript配置文件，定义TypeScript编译选项。
- **tsconfig.app.json**: TypeScript应用配置，针对应用代码的特定配置。
- **tsconfig.node.json**: Node.js环境的TypeScript配置，用于构建脚本等。
- **vite.config.ts**: Vite构建工具配置文件，定义构建和开发服务器选项。

#### 依赖管理

- **package.json**: 项目配置文件，包含项目信息、脚本命令和依赖声明。
- **package-lock.json**: 依赖版本锁定文件，确保在不同环境中安装相同版本的依赖。
- **node_modules/**: Node.js依赖包目录，存储项目所需的所有第三方库。

#### 源代码和页面

- **index.html**: 应用主入口HTML文件，通常包含应用的根容器和必要的元数据。
- **home1.html**: 备用首页HTML文件，可能是另一个入口页面或备用设计。
- **profile.html**: 用户个人资料页面，显示用户信息的页面。
- **src/**: 源代码目录，包含应用的主要代码，详细结构如下：
  - **App.vue**: 应用主组件，作为所有其他组件的容器
  - **main.ts**: 应用入口文件，负责初始化Vue应用实例
  - **api/**: API接口调用模块
    - **applyApi.ts**: 申请相关API接口
    - **index.ts**: API模块入口文件
    - **petApi.ts**: 宠物相关API接口
    - **userApi.ts**: 用户相关API接口
  - **assets/**: 静态资源目录
    - **icons/**: 图标资源
      - **logo.svg**: 项目Logo图标
    - **images/**: 图片资源目录
    - **styles/**: 样式文件目录
      - **base.css**: 基础样式定义
      - **main.css**: 主要样式文件
  - **components/**: Vue组件目录
    - **business/**: 业务组件目录
    - **common/**: 通用组件目录
      - **Footer.vue**: 页脚组件
      - **NavBar.vue**: 导航栏组件
      - **PetCard.vue**: 宠物卡片组件
  - **router/**: 路由配置目录
    - **index.ts**: 路由配置入口文件，定义应用的路由规则
  - **stores/**: 状态管理目录
    - **counter.ts**: 计数器状态管理示例
  - **utils/**: 工具函数目录
    - **format.ts**: 数据格式化工具
    - **injectAssets.ts**: 资源注入工具
    - **storage.ts**: 本地存储工具
    - **validate.ts**: 数据验证工具
  - **views/**: 页面视图组件目录
    - **error/**: 错误页面目录
      - **404.vue**: 404错误页面
    - **forum/**: 论坛相关页面
      - **PostDetail.vue**: 帖子详情页面
      - **PostList.vue**: 帖子列表页面
    - **home/**: 首页目录
      - **Home.vue**: 首页组件
    - **pet/**: 宠物相关页面
      - **PetDetail.vue**: 宠物详情页面
      - **PetList.vue**: 宠物列表页面
    - **talk/**: 交流页面目录
      - **Talk.vue**: 交流页面组件
    - **user/**: 用户相关页面
      - **Login.vue**: 登录页面
      - **Profile.vue**: 用户个人资料页面
      - **Register.vue**: 注册页面
- **public/**: 公共资源目录，存放不会被构建工具处理的静态资源。

#### 构建输出

- **dist/**: 构建输出目录，包含构建后的生产环境文件。
  - **assets/**: 构建后的静态资源（CSS、JavaScript、图片等）。
  - **favicon.ico**: 网站图标，显示在浏览器标签栏。
  - **index.html**: 构建后的主HTML文件，可直接部署到服务器。

## 项目技术栈

根据项目结构推断，该项目使用了以下技术栈：

- **前端框架**: Vue.js（基于node_modules中的@vue、vue等包判断）
- **构建工具**: Vite（基于vite.config.ts和node_modules中的vite包判断）
- **语言**: TypeScript（基于tsconfig.json和.ts文件判断）
- **CSS框架**: Tailwind CSS（基于tailwind.config.ts判断）
- **代码质量工具**: ESLint和Prettier（基于配置文件判断）
- **CSS处理**: PostCSS（基于postcss.config.ts判断）

## 开发说明

### 安装依赖

```bash
cd furever_home_v1
npm install
```

### 开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 代码检查

```bash
npm run lint
```

### 代码格式化

```bash
npm run format
```

## 注意事项

1. 项目使用TypeScript进行开发，确保所有代码符合TypeScript语法规范。
2. 使用ESLint和Prettier保证代码质量和风格一致性。
3. 开发时修改src目录下的文件，构建后的文件会输出到dist目录。
4. 静态资源优先放在public目录，这样它们不会被构建工具处理。
