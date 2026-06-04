/**
 * @Project : vue-map-test
 * @Time    : 2026-05-27 17:13:25
 * @Author  : ZZQ
 * @Desc    : todo
 */
import type { Feature } from 'ol'
import RenderFeature from "ol/render/Feature"
import { Fill, Stroke, Style } from 'ol/style'
import { Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource } from 'ol/source'
import GeoJSON from 'ol/format/GeoJSON'
import { Geometry, SimpleGeometry } from 'ol/geom'
import * as olProj from 'ol/proj'

type FeatureLike = Feature | RenderFeature

// 国界层
const boundaryLayer =  new VectorLayer({
  source: new VectorSource({
    url: '/100000_boundary.json',
    format: new GeoJSON(),
  }),
  style: [
    {
      filter: ['==', ['get', 'type'], '国界'],
      style: {
        'stroke-color': '#d60e3d',
        'stroke-width': 2,
      },
    },
    {
      filter: ['==', ['get', 'type'], '争议'],
      style: {
        'stroke-color': '#d60e3d',
        'stroke-width': 2,
        // 虚线样式, 6px 线段 + 6px 间隔
        'stroke-line-dash': [6, 6],
        // 虚线偏移量
        'stroke-line-dash-offset': 0,
        // 线帽样式
        'stroke-line-cap': 'round',
      },
    },
    {
      filter: ['==', ['get', 'type'], '海洋'],
      style: {
        'stroke-color': '#0099ff',
        'stroke-width': 1,
        // 虚线样式, 6px 线段 + 6px 间隔
        'stroke-line-dash': [6, 6],
        // 虚线偏移量
        'stroke-line-dash-offset': 0,
        // 线帽样式
        'stroke-line-cap': 'round',
      },
    },
    {
      else: true,
      style:
        {
          'stroke-color': 'rgb(44 44 44 / 0.8)',
          'stroke-width': 0,
          'stroke-line-dash': [6, 6],
          'stroke-line-dash-offset': 0,
          'stroke-line-cap': 'round',
        }
    },
  ],
  properties: { curLevel: 'china' }
  // maxZoom: 10
})

// 省界层
const fullBoundarySource = new VectorSource({
  url: '/100000_full.json',
  format: new GeoJSON()
})

// 存储每个边界的顶点坐标
const vertex = new Map<number, number[]>()

/**
 * 获取 Geometry 中 Y 值最大（最北/最上）的坐标点
 * 支持 Polygon、MultiPolygon、LineString、MultiLineString 等
 */
function getVertexCoordinate(geometry: Geometry): number[] | null {
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
    extractCoords(geometry.getCoordinates()![0])
  }

  return vertex
}

function loadVertex() {
  const source = fullBoundarySource
  // 已有的先处理
  for (const feature of source.getFeatures()) {
    computeVertex(feature)
  }

  // 后续新来的也处理
  source.on('addfeature', (e) => {
    computeVertex(e.feature as Feature<Geometry>)
  })

  // 添加一些手动修正项
  // 台湾
  // vertex.set(710000, [])

  return vertex
}

function computeVertex(feature: Feature<Geometry>) {
  const geometry = feature.getGeometry()
  if (!geometry) return
  const vertexCoordinate = getVertexCoordinate(geometry)
  if (vertexCoordinate) {
    const lonLat = olProj.toLonLat(vertexCoordinate)
    vertex.set(feature.getProperties().adcode, lonLat)
  }
}

function getFullBoundaryLayer() {
  return new VectorLayer({
    source: fullBoundarySource,
    style: getFullBoundaryStyle,
    properties: { level: 'china' }
  })
}

function getFullBoundaryStyle(feature: FeatureLike) {
  return new Style({
    fill: new Fill({
      color: 'rgb(243 243 243 / 0.6)',
    }),
  })
}


export { boundaryLayer, getFullBoundaryLayer, loadVertex, getVertexCoordinate }
