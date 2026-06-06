/**
 * @Project : geo-json-map
 * @Time    : 2026-06-05 11:28:49
 * @Author  : ZZQ
 * @Desc    : 几何对象创建工具
 */
import { Polygon } from 'ol/geom'
import type { Coordinate } from 'ol/coordinate'
import type { Extent } from 'ol/extent'

/**
 * 从 顶点数组 创建四边形
 * @param extent 顶点数组
 */
export function createPolygonFromExtent(extent: Extent): Polygon {
  const [minX = 0, minY = 0, maxX = 0, maxY = 0] = extent
  // 多边形的 ring 必须闭合（首尾坐标相同）
  const coordinates: Coordinate[] = [
    [minX, minY], // 左下
    [maxX, minY], // 右下
    [maxX, maxY], // 右上
    [minX, maxY], // 左上
    [minX, minY], // 回到起点（闭合）
  ]
  return new Polygon([coordinates])
}
