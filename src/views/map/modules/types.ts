/**
 * @Project : geo-json-map
 * @Time    : 2026-06-05 09:41:58
 * @Author  : ZZQ
 * @Desc    : 统一管理所有接口和类型
 */
import type BaseLayer from 'ol/layer/Base'
import type { Overlay } from 'ol'

// 行为类型 下钻 | 上卷
export type Action = 'DRILL_DOWN' | 'ROLL_UP'

// 图层信息
export type LevelLayer = {
  // 区域层
  mapLayer: BaseLayer | null
  // 边界层
  boundaryLayer: BaseLayer | null
}

// 弹窗数据
export interface PopupData {
  name: string
  adcode: string
  level: string
}

// 弹窗选项
export interface MoveEventOptions {
  // 弹窗实例
  popup: Overlay
  // 弹窗控制
  popupCtrl: {
    show(): void
    hide(): void
  }
  // 弹窗数据
  popupData: PopupData
}
