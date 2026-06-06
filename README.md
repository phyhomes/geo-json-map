# geo-json-map

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

```
src/views/map/modules/
├── index.ts                    # 统一导出入口
├── types.ts                    # 所有类型和接口定义
├── constants.ts                # 常量配置（中心点、范围、转换规则）
│
├── layers/                     # 📁 图层相关（创建、样式、管理）
│   ├── index.ts               # 图层统一导出
│   ├── boundary.ts            # 边界图层（国界、省界线）
│   ├── region.ts              # 区域填充图层（省/市/区）
│   └── styles.ts              # 样式定义（集中管理所有Style）
│
├── interactions/               # 📁 交互事件（用户操作响应）
│   ├── index.ts               # 交互统一导出
│   ├── hover.ts               # 鼠标悬停（pointermove）
│   ├── click.ts               # 单击事件（下钻/上卷核心逻辑）
│   └── navigation.ts          # 导航辅助（视图调整、拖动处理）
│
├── services/                   # 📁 业务服务（数据处理、查询）
│   ├── index.ts               # 服务统一导出
│   ├── drill.ts               # 下钻/上钻业务逻辑
│   ├── query.ts               # Feature查询工具
│   └── geometry.ts            # 几何计算（顶点、坐标转换）
│
└── components/
└── MapPopup.vue           # UI组件保持不变
```