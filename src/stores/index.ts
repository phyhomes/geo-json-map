/**
 * @Project : geo-json-map
 * @Time    : 2026-06-05 20:30:46
 * @Author  : ZZQ
 * @Desc    : todo
 */

import type { App } from 'vue'
import { createPinia } from 'pinia'

export const store = createPinia()

/**
 * 初始化 Store
 */
export function initStore(app: App<Element>): void {
  app.use(store)
}

/**
 * 导出 所有 Store
 */
export * from './modules/map'
