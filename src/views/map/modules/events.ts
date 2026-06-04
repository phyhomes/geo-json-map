/**
 * @Project : vue-map-test
 * @Time    : 2026-05-28 15:50:20
 * @Author  : ZZQ
 * @Desc    : todo
 */
import { Feature, Map, type Overlay } from 'ol'
import type FeatureLike from 'ol/Feature'
import type { PopupData } from '@/types'
import * as olProj from 'ol/proj'
import { getVertexCoordinate, loadVertex } from '@/views/map/modules/boundry.ts'
import { getLevelLayer } from '@/views/map/modules/province.ts'
import type { Pixel } from 'ol/pixel'
import type BaseLayer from 'ol/layer/Base'
import { Geometry, Polygon } from 'ol/geom'
import type { Coordinate } from 'ol/coordinate'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Fill, Stroke, Style } from 'ol/style'


interface MoveEventOptions {
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

function createPolygonFromExtent(extent: number[]): Polygon {
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

const center = [116.407394, 39.904211]
const provinceVertex = loadVertex()
const CHINA_EXTENT = olProj.transformExtent(
  [73, 4, 135, 54],
  'EPSG:4326',
  'EPSG:3857',
)

const chinaGeometry = createPolygonFromExtent(CHINA_EXTENT)
const chinaFeature = new Feature({
  geometry: chinaGeometry,
  name: '中国',
  level: 'china',
  childrenNum: 34
})

let currLevel: Level = 'china'

// 处理鼠标移动事件
export function attachMoveEvents(map: Map, opts: MoveEventOptions) {
  let lastFeature: Feature | null = null
  // 绑定鼠标移动事件
  map.on('pointermove', (event) => {
    // 如果当前是拖动行为，不处理
    if (event.dragging) return

    // 移除掉之前的hover状态
    // if (lastHoveredFeature) {
    //   lastHoveredFeature = null
    // }

    // 获取当前鼠标所在像素
    const pixel = event.pixel
    // 获取当前鼠标所在像素的所有feature
    const features = map.getFeaturesAtPixel(pixel, {
      // 过滤出省级feature
      layerFilter: (layer) => layer.get('level') === currLevel,
      hitTolerance: 8,
    })

    // // 过滤出省级feature
    // const features = allFeatures?.filter((f) => {
    //   const parent = f.get('parent')
    //   return parent && parent.adcode === 100000
    // })
    // console.log(features)
    if (features && features.length > 0) {
      const currentFeature = features[0] as FeatureLike

      // 如果当前feature和上一次的feature相同，则不处理
      if (currentFeature == lastFeature) return
      // 切换省份
      lastFeature = currentFeature
      const props = lastFeature.getProperties()
      const coordinate = olProj.fromLonLat(provinceVertex.get(props.adcode) || center)
      opts.popup.setPosition(coordinate)
      opts.popupCtrl.show()
      opts.popupData.name = props.name || ''
      opts.popupData.adcode = props.adcode || ''
      opts.popupData.level = props.level || ''

      // 鼠标变为 pointer
      const target = map.getTargetElement()
      if (target) {
        (target as HTMLElement).style.cursor = 'pointer'
      }
    } else {
      opts.popup.setPosition(undefined)
      opts.popupCtrl.hide()
      lastFeature = null

      // 恢复鼠标的默认样式
      const target = map.getTargetElement()
      if (target) {
        (target as HTMLElement).style.cursor = ''
      }
    }
  })
}

type Level = 'china' | 'province' | 'city' | 'county'

type Action = 'DRILL_DOWN' | 'ROLL_UP'

const TRANSITIONS: Record<Level, Record<Action, Level | null>> = {
  china: { DRILL_DOWN: 'province', ROLL_UP: null },
  province: { DRILL_DOWN: 'city', ROLL_UP: 'china' },
  city: { DRILL_DOWN: 'county', ROLL_UP: 'province' },
  county: { DRILL_DOWN: null, ROLL_UP: 'city' },
}

// 处理鼠标单击事件
function attachSingleClickEvents(map: Map) {
  let drillAble = true
  const layerStack: BaseLayer[] = []
  const featureStack: FeatureLike[] = []
  featureStack.push(chinaFeature)
  // 绑定鼠标单击事件
  map.on('singleclick', (event) => {
    const pixel = event.pixel

    const nextLevel = TRANSITIONS[currLevel].DRILL_DOWN
    const prevLevel = TRANSITIONS[currLevel].ROLL_UP
    const features = queryFeatures(map, pixel, currLevel)
    if (features && features.length > 0) {
      if (drillAble) {
        // 压栈当前层
        map.getLayers().forEach((layer) => {
          if (layer.get('level') === currLevel) {
            layerStack.push(layer)
          }
        })
        // 压栈当前点击的feature
        featureStack.push(features[0] as FeatureLike)
        // 移除当前层
        map.removeLayer(layerStack[layerStack.length - 1]!)
        // if (layerStack[layerStack.length - 2]) {
        //   map.removeLayer(layerStack[layerStack.length - 2]!)
        // }

        drillAble = features[0]!.getProperties()['childrenNum'] > 0

        console.log('当前点击的feature:', features[0])

        // 下钻
        handleDrillDown(map, features[0] as FeatureLike, nextLevel as Level)

        // 更新当前层级
        currLevel = nextLevel as Level
      } else {
        return
      }
    } else if (prevLevel) {
      // 上卷
      // 移除当前层
      removeLayersByLevel(map, currLevel)
      const layer1 = layerStack.pop()
      map.addLayer(layer1!)
      // const layer2 = layerStack.pop()
      // if (layer2) {
      //   map.addLayer(layer2)
      // }
      currLevel = prevLevel


      // 扔掉当前的级别
      featureStack.pop()
      // 要回的是上一级别，但是不扔它
      const feature = featureStack[featureStack.length - 1]
      drillAble = feature!.getProperties()['childrenNum'] > 0
      if (!feature) return
      console.log('回退：', feature)
      const geometry = feature.getGeometry()
      adjustView(map, geometry)
    }
  })
}


function handleDrillDown(map: Map, feature: FeatureLike, nextLevel: Level) {
  const props = feature.getProperties()
  const coordinate = olProj.fromLonLat(props['center'])
  const currAdcode: string = props['adcode']

  // 如果还能下钻 加一层轮廓层
  // const drillAble = feature.getProperties()['childrenNum'] > 0
  // if (drillAble) {
  //   const boundaryLayer = new VectorLayer({
  //     source: new VectorSource({
  //       features: [feature],
  //     }),
  //     style: new Style({
  //       fill: new Fill({
  //         color: 'rgba(255, 255, 255, 0.1)',
  //       }),
  //       stroke: new Stroke({
  //         color: '#070606',
  //         width: 1.25,
  //       }),
  //     }),
  //     properties: {
  //       level: nextLevel,
  //     },
  //   })
  //   map.addLayer(boundaryLayer)
  // }

  const layer = getLevelLayer(nextLevel, currAdcode)

  map.addLayer(layer)
  layer.getSource()?.refresh()

  const source = layer.getSource()
  if (source) {
    for (const feature of source.getFeatures()) {
      computeVertex(feature)
    }
    source.on('addfeature', (e) => {
      computeVertex(e.feature as Feature<Geometry>)
    })
  }

  const geometry = feature.getGeometry()
  adjustView(map, geometry)
  // map.getView().setCenter(coordinate)
}

function queryFeatures(map: Map, pixel: Pixel, level: Level) {
  return map.getFeaturesAtPixel(pixel, {
    layerFilter: (layer) => layer.get('level') === level,
    hitTolerance: 8,
  })
}

function removeLayersByLevel(map: Map, level: Level) {
  const needRemoveLayers: BaseLayer[] = []
  map.getLayers().forEach((layer) => {
    if (layer.get('level') === level) {
      needRemoveLayers.push(layer)
    }
  })
  needRemoveLayers.forEach((layer) => {
    map.removeLayer(layer)
  })
}

function computeVertex(feature: Feature<Geometry>) {
  const geometry = feature.getGeometry()
  if (!geometry) return
  const vertexCoordinate = getVertexCoordinate(geometry)
  if (vertexCoordinate) {
    const lonLat = olProj.toLonLat(vertexCoordinate)
    provinceVertex.set(feature.getProperties().adcode, lonLat)
  }
}

function adjustView(map: Map, geometry: Geometry | undefined){
  const maxHeight = 100
  if (geometry) {
    map.getView().fit(geometry.getExtent(), {
      padding: [maxHeight, maxHeight, maxHeight, maxHeight],
      duration: 500,
    })
  }
}


export function attachEvents(map: Map) {
  attachSingleClickEvents(map)
  attachMoveEndEvent(map)
}

// 解决无缝拖动问题
function attachMoveEndEvent(map: Map) {
  map.on('moveend', ()=>{
    const view = map.getView()
    const center = view.getCenter()!
    const extend = view.getProjection().getExtent()
    const worldWidth = extend[2]! - extend[0]!
    const x = center[0]!
    // 重设中心点
    view.setCenter([
      ((((x-extend[0]!) % worldWidth) + worldWidth) % worldWidth) + extend[0]!,
      center[1]!
    ])
  })
}
