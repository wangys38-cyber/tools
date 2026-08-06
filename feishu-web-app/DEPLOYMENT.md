# 飞书测试任务管理应用 - 部署指南

## 项目结构

```
feishu-web-app/
├── index.html          # 主入口页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── app.js          # 业务逻辑
├── package.json        # 项目配置
└── DEPLOYMENT.md       # 部署指南
```

## 部署方式

### 方式一：GitHub Pages 部署

1. **安装依赖**
```bash
npm install
```

2. **构建项目**
```bash
npm run build
```

3. **部署到GitHub Pages**
```bash
npm run deploy
```

### 方式二：静态文件托管

直接将以下文件上传到任何静态文件托管服务：
- `index.html`
- `css/style.css`
- `js/app.js`

推荐的托管服务：
- GitHub Pages (免费)
- Vercel (免费)
- Netlify (免费)
- 阿里云OSS
- 腾讯云COS

### 方式三：飞书自建应用部署

1. **在飞书开放平台创建应用**
   - 访问 https://open.feishu.cn/
   - 创建「网页应用」
   - 记录 App ID 和 App Secret

2. **配置应用**
   - 设置应用首页URL为你的部署地址
   - 配置安全域名
   - 设置权限范围

3. **更新SDK配置**
   - 在 `index.html` 第10行替换 `cli_aaa50689fff81bb7` 为你的应用ID

## 本地开发测试

```bash
# 使用Python启动本地服务器
python -m http.server 8000

# 使用PHP启动本地服务器
php -S localhost:8000

# 使用Node.js (需要安装)
npx http-server -p 8000
```

访问 http://localhost:8000

## 飞书配置说明

### 飞书SDK配置

当前SDK配置：
- App ID: `cli_aaa50689fff81bb7`

如需更换，请修改 `index.html` 文件：
```html
<script src="https://lf-copilot.bytedance.net/api/text/sdk.js?appId=你的应用ID"></script>
```

### 飞书应用配置项

| 配置项 | 值 |
|--------|-----|
| 应用类型 | 网页应用 |
| 首页URL | 你的部署地址 |
| 安全域名 | 你的域名 |
| 权限范围 | contacts:user:readonly |

## 环境要求

- 无需后端服务，纯前端应用
- 所有数据存储在浏览器 localStorage
- 需要支持ES6+的现代浏览器

## 功能特性

1. **用户认证** - 飞书OAuth登录
2. **任务管理** - 创建、查看、删除任务
3. **测试人员管理** - 添加、删除测试人员
4. **进度跟踪** - 更新测试进度
5. **统计分析** - 任务状态分布、进度趋势
