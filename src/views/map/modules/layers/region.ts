/**
 * @Project : geo-json-map
 * @Time    : 2026-06-05 09:54:18
 * @Author  : ZZQ
 * @Desc    : 区域填充图层（省市区）
 */
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import type { MapLevel } from '@/types'
import { chinaLayerStyle, getLevelStyle } from '@/views/map/modules/layers'
import { Feature } from 'ol'
import { createPolygonFromExtent } from '@/utils'
import { XYZ } from 'ol/source'
import * as olProj from 'ol/proj'
import { CHINA_EXTENT } from '@/views/map/modules/constants'

/**
 * 缓存各行政级别的layer 键是 adcode 值是 source
 */
const levelLayerCache = new Map<string, VectorLayer>()

// 瓦片底图
const tileLayer = new TileLayer({
  // 数据来源
  source: new XYZ({
    url: 'https://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
  }),
})

// 中国各省（市）feature数据
const chinaSource = new VectorSource({
  url: '/100000_full.json',
  format: new GeoJSON(),
})

// 中国各省（市）填充图层
const chinaLayer = new VectorLayer({
  source: chinaSource,
  style: chinaLayerStyle,
  properties: { level: 'nation' } satisfies { level: MapLevel },
})

/**
 * 获取各行政级别的图层
 * @param level 行政级别 province | city | county
 * @param adcode 行政代码
 */
function getLevelLayer(level: MapLevel, adcode: string) {
  adcode = String(adcode)

  const cached = levelLayerCache.get(adcode)
  if (cached) return cached

  // 根据adcode判断是否可下钻
  const drillAble = adcode.endsWith('00')

  const levelLayer = new VectorLayer({
    source: getLevelSource(level, adcode),
    style: getLevelStyle(drillAble),
    properties: {
      level: level,
    },
  })

  levelLayerCache.set(adcode, levelLayer)
  return levelLayer
}

/**
 * 获取各行政级别的source
 * @param level 行政级别 province | city | county
 * @param adcode 行政代码
 */
function getLevelSource(level: MapLevel, adcode: string) {
  return new VectorSource({
    url: `/${level}/${adcode}.json`,
    format: new GeoJSON(),
  })
}

// 中国的简易feature 用户视图管理
const chinaFeature = new Feature({
  geometry: createPolygonFromExtent(olProj.transformExtent(CHINA_EXTENT, 'EPSG:4326', 'EPSG:3857')),
  name: '中国',
  level: 'china',
  childrenNum: 34,
})

export { tileLayer, chinaSource, chinaLayer, chinaFeature, getLevelLayer }
