/**
 * @Project : geo-json-map
 * @Time    : 2026-06-05 19:29:40
 * @Author  : ZZQ
 * @Desc    : 几何对象计算
 */

import { type Geometry, SimpleGeometry } from 'ol/geom'

/**
 * 获取 Geometry 中 Y 值最大（最北/最上）的坐标点
 * 支持 Polygon、MultiPolygon、LineString、MultiLineString 等
 */
export function getVertexCoordinate(geometry: Geometry): number[] | null {
  let vertex: number[] | null = null
  let maxY = -Infinity

  type Coordinate = number | Coordinate[]

  // 递归提取所有坐标点
  function extractCoords(coords: Coordinate) {
    if (!Array.isArray(coords)) return

    // 判断是否为 [x, y] 形式的坐标点
    if (typeof coords[0] === 'number' && typeof coords[1] === 'number') {
      if (coords[1] > maxY) {
        maxY = coords[1]
        vertex = coords as number[]
      }
      return
    }

    // 是嵌套数组，继续递归
    for (const c of coords) {
      extractCoords(c)
    }
  }

  if (geometry instanceof SimpleGeometry) {
    // 只取了第一个
    extractCoords(geometry.getCoordinates()![0])
  }

  return vertex
}
