/**
 * @Project : geo-json-map
 * @Time    : 2026-06-05 15:11:18
 * @Author  : ZZQ
 * @Desc    : 查询服务
 */

import { Map } from 'ol'
import type { Pixel } from 'ol/pixel'
import type { MapLevel } from '@/types'

/**
 * 查询地图上指定像素点所在的feature
 * @param map 地图对象
 * @param pixel 像素点
 * @param level 行政级别
 */
function queryFeatures(map: Map, pixel: Pixel, level: MapLevel) {
  return map.getFeaturesAtPixel(pixel, {
    layerFilter: (layer) => layer.get('level') === level,
    hitTolerance: 8,
  })
}

export { queryFeatures }
