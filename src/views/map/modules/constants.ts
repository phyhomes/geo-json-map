/**
 * @Project : geo-json-map
 * @Time    : 2026-06-05 09:47:08
 * @Author  : ZZQ
 * @Desc    : 常量配置
 */
import type { MapLevel } from '@/types'
import type { Action } from './types'

// 中国中心点 - 六朝古都西安
export const CENTER: [number, number] = [116.407394, 39.904211] as const

// 中国范围
export const CHINA_EXTENT: [number, number, number, number] = [73, 4, 135, 54] as const

// 层级转换规则表
export const TRANSITIONS: Record<MapLevel, Record<Action, MapLevel | null>> = {
  nation: { DRILL_DOWN: 'province', ROLL_UP: null },
  province: { DRILL_DOWN: 'city', ROLL_UP: 'nation' },
  city: { DRILL_DOWN: 'county', ROLL_UP: 'province' },
  county: { DRILL_DOWN: null, ROLL_UP: 'city' },
}
