/**
 * @Project : geo-json-map
 * @Time    : 2026-05-28 17:21:48
 * @Author  : ZZQ
 * @Desc    : 组件类型定义模块
 * 提供项目组件的类型定义
 */

export interface PopupData {
  name: string
  adcode: string
  level: string
}

// 行政级别类型 国 省 市 县
export type MapLevel = 'nation' | 'province' | 'city' | 'county'
