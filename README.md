


<div align="center">

# 🗺️ GeoJSON Map

</div>

> 基于 **Vue 3 + OpenLayers + Pinia + TypeScript** 的中国行政区划地图应用，支持国 → 省 → 市 → 县 **四级下钻 / 上卷**交互。整体仿照 [阿里DataV数据可视化平台](https://datav.aliyun.com/portal/school/atlas/area_selector) 上的范围选择器设计。

<div align="center">

![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vuedotjs&logoColor=white)
![OpenLayers](https://img.shields.io/badge/OpenLayers-10.9-1B6B93?logo=openstreetmap&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-3.x-FFC107?logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white)

</div>

## ✨ 功能特性

- 🗺️ **瓦片底图**：使用地图 XYZ 瓦片服务作为底图
- 🌍 **行政区划渲染**：GeoJSON 数据驱动，区域填充 + 边界线分层展示
- 🔍 **多级钻取**：点击区域逐级下钻（国 → 省 → 市 → 县），点击空白区域逐级回退
- 💡 **鼠标悬停**：实时显示当前区域的行政区划代码（adcode）、名称和级别
- 🖱️ **无缝拖动**：处理地图跨越世界边界时的拖动修正
- 📦 **图层缓存**：已加载的图层按 `${adcode}` 缓存，避免重复网络请求

## 🛠️ 技术栈

| 技术 |  版本  | 说明 |
|:---:|:----:|:---|
| ![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vuedotjs&logoColor=white) | 3.5  | 渐进式 JavaScript 框架 |
| ![OpenLayers](https://img.shields.io/badge/OpenLayers-10.9-1B6B93?logo=openstreetmap&logoColor=white) | 10.9 | 开源 Web GIS 地图库 |
| ![Pinia](https://img.shields.io/badge/Pinia-3.x-FFC107?logo=vuedotjs&logoColor=white) | 3.x  | Vue 状态管理 |
| ![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178C6?logo=typescript&logoColor=white) | 6.x  | 类型安全 |
| ![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white) | 8.x  | 构建工具 |
| ![pnpm](https://img.shields.io/badge/pnpm-F69220?logo=pnpm&logoColor=white) | 10.x | 包管理器 |

## 📂 项目结构

```
src/
├── main.ts                          # 🚀 应用入口
├── App.vue                          # 🏠 根组件
├── stores/                          # 💾 Pinia 状态管理
│   └── modules/
│       └── map.ts                   # 地图状态（当前层级 currLevel）
├── types/                           # 📝 类型定义
│   └── component/
│       └── index.ts                 # PopupData, MapLevel 等类型
├── utils/                           # 🔧 工具函数
│   └── geometry/
│       ├── compute.ts               # 几何计算（获取最北顶点）
│       └── create.ts                # 从 Extent 创建 Polygon
└── views/
    └── map/
        ├── index.vue                # 🗺️ 地图主视图（入口组件）
        └── modules/
            ├── constants.ts          # ⚙️ 常量配置（中心点、范围、层级转换规则）
            ├── types.ts             # 📝 模块内部类型定义
            ├── MapPopup.vue         # 💬 弹窗组件
            ├── layers/              # 🎨 图层管理
            │   ├── boundary.ts      # 边界图层（国界、省界线）
            │   ├── region.ts        # 区域填充图层 + 瓦片底图
            │   └── styles.ts        # 样式集中定义
            ├── interactions/         # 🖱️ 交互事件
            │   ├── move.ts          # 鼠标移动 → 弹窗跟随
            │   ├── moveEnd.ts       # 拖动结束 → 中心修正
            │   └── singleClick.ts   # 单击 → 下钻 / 上卷
            └── services/            # 🔌 业务服务
                ├── geometry.ts      # 区域顶点坐标加载
                └── query.ts         # Feature 像素查询
```

## 🚀 快速开始

### ⚙️ 环境要求

- Node.js >= 20.19.0 或 >= 22.12.0
- pnpm

### 📦 安装依赖

```sh
pnpm install
```

### 🧪 启动开发服务器

```sh
pnpm dev
```

### 🏗️ 构建生产版本

```sh
pnpm build
```

### 🔍 代码检查

```sh
pnpm lint
```

### 🎨 格式化代码

```sh
pnpm format
```

## 📊 数据说明

行政区划 GeoJSON 数据位于 `public/` 目录，按行政层级分目录存放：

```
public/
├── 100000_full.json                 # 全国各省市完整 GeoJSON
├── 100000_boundary.json             # 国界、省界边界线 GeoJSON
├── province/                        # 📍 省级区划 GeoJSON（adcode 命名）
├── city/                            # 🏙️ 市级区划 GeoJSON
└── county/                          # 🏘️ 县级区划 GeoJSON
```

| 目录 | 说明 | 示例 |
|:---:|:---|:---|
| 📍 `province/` | 省级 | `350000.json`（福建省） |
| 🏙️ `city/` | 市级 | `350500.json`（泉州市） |
| 🏘️ `county/` | 县级 | `350503.json`（丰泽区） |

文件名即为 **adcode（行政区划代码）**，通过 `/${level}/${adcode}.json` 动态加载。

> 📎 **数据来源**
>
> - GeoJSON 数据全部来自 [阿里DataV数据可视化平台](https://datav.aliyun.com/portal/school/atlas/area_selector)
> - 使用开源项目 [ChinaGeoJson](https://github.com/zhChuXiao/ChinaGeoJson) 批量获取数据

## 📄 License

[MIT](./LICENSE)
