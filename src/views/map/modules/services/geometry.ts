/**
 * @Project : geo-json-map
 * @Time    : 2026-06-05 15:11:46
 * @Author  : ZZQ
 * @Desc    : 几何服务
 */

import type VectorSource from 'ol/source/Vector'
import type { Feature } from 'ol'
import { getVertexCoordinate } from '@/utils'
import * as olProj from 'ol/proj'

/**
 * 存储区域的顶点 键是adcode 值是顶点坐标
 */
const regionVertex = new Map<number, number[]>()

/**
 * 存储处理过的source 以url为key
 */
const loadedSources = new Set<string>()

function loadRegionVertex(source: VectorSource) {
  console.log('source', source.getUrl())
  if (loadedSources.has(source.getUrl() as string)) return
  loadedSources.add(source.getUrl() as string)

  // 已有的先处理
  for (const feature of source.getFeatures()) {
    computeVertex(feature)
  }

  // 后续新来的也处理
  source.on('addfeature', (e) => {
    computeVertex(e.feature as Feature)
  })

  // 添加一些手动修正项
  // 台湾
  // vertex.set(710000, [])
}

function computeVertex(feature: Feature) {
  const geometry = feature.getGeometry()
  if (!geometry) return
  const vertexCoordinate = getVertexCoordinate(geometry)
  if (vertexCoordinate) {
    const lonLat = olProj.toLonLat(vertexCoordinate)
    regionVertex.set(feature.getProperties().adcode, lonLat)
  }
}

export { regionVertex, loadRegionVertex }
