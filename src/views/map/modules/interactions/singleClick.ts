/**
 * @Project : geo-json-map
 * @Time    : 2026-06-05 10:34:18
 * @Author  : ZZQ
 * @Desc    : 处理单击事件
 */
import { Map } from 'ol'
import type BaseLayer from 'ol/layer/Base'
import type FeatureLike from 'ol/Feature'
import type { MapLevel } from '@/types'
import type { LevelLayer } from '@/views/map/modules/types'
import { TRANSITIONS } from '@/views/map/modules/constants'
import { useMapStore } from '@/stores'
import { chinaFeature, getLevelBoundaryLayer, getLevelLayer } from '@/views/map/modules/layers'
import { Geometry } from 'ol/geom'
import { queryFeatures } from '@/views/map/modules/services'
import * as olProj from 'ol/proj'
import { storeToRefs } from 'pinia'
import { loadRegionVertex } from '@/views/map/modules/services'

// 处理鼠标单击事件
function attachSingleClickEvent(map: Map) {
  const mapStore = useMapStore()
  const { currLevel } = storeToRefs(mapStore)
  let drillAble = true
  const layerStack: LevelLayer[] = []
  const featureStack: FeatureLike[] = []
  featureStack.push(chinaFeature)
  // 绑定鼠标单击事件
  map.on('singleclick', (event) => {
    const pixel = event.pixel

    const nextLevel = TRANSITIONS[currLevel.value].DRILL_DOWN
    const prevLevel = TRANSITIONS[currLevel.value].ROLL_UP
    const features = queryFeatures(map, pixel, currLevel.value)
    if (features && features.length > 0) {
      if (drillAble) {
        // 压栈当前层
        const layers = map.getLayers().getArray()
        const mapLayer = layers.find((l) => l.get('level') === currLevel.value) ?? null
        const boundaryLayer =
          layers.find((l) => l.get('level') === 'boundary-' + currLevel.value) ?? null
        layerStack.push({ mapLayer, boundaryLayer })

        // 压栈当前点击的feature
        featureStack.push(features[0] as FeatureLike)
        // 移除当前层
        map.removeLayer(layerStack[layerStack.length - 1]!.mapLayer!)
        map.removeLayer(layerStack[layerStack.length - 1]!.boundaryLayer!)

        drillAble = features[0]!.getProperties()['childrenNum'] > 0

        console.log('当前点击的feature:', features[0])

        // 下钻
        handleDrillDown(map, features[0] as FeatureLike, nextLevel as MapLevel)

        // 更新当前层级
        currLevel.value = nextLevel as MapLevel
      } else {
        return
      }
    } else if (prevLevel) {
      // 上卷
      // 移除当前层
      removeLayersByLevel(map, currLevel.value)
      const layer = layerStack.pop()
      if (layer?.mapLayer) {
        map.addLayer(layer.mapLayer)
      }
      if (layer?.boundaryLayer) {
        map.addLayer(layer.boundaryLayer)
      }

      currLevel.value = prevLevel

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

function handleDrillDown(map: Map, feature: FeatureLike, nextLevel: MapLevel) {
  const props = feature.getProperties()
  const coordinate = olProj.fromLonLat(props['center'])
  const currAdcode: string = props['adcode']

  // 如果还能下钻 加一层轮廓层
  const drillAble = feature.getProperties()['childrenNum'] > 0
  if (drillAble) {
    const boundaryLayer = getLevelBoundaryLayer(feature, nextLevel)
    map.addLayer(boundaryLayer)
  }

  const layer = getLevelLayer(nextLevel, currAdcode)

  map.addLayer(layer)
  // layer.getSource()?.refresh()

  // 加载顶点坐标
  const source = layer.getSource()
  if (source) {
    loadRegionVertex(source)
  }

  // 调整视图
  const geometry = feature.getGeometry()
  adjustView(map, geometry)
}

// 移除指定行政级别的所有图层
function removeLayersByLevel(map: Map, level: MapLevel) {
  const needRemoveLayers: BaseLayer[] = []
  map.getLayers().forEach((layer) => {
    if (layer.get('level') === level) {
      needRemoveLayers.push(layer)
    }
    if (layer.get('level') === 'boundary-' + level) {
      needRemoveLayers.push(layer)
    }
  })
  needRemoveLayers.forEach((layer) => {
    map.removeLayer(layer)
  })
}

// 调整视图
function adjustView(map: Map, geometry: Geometry | undefined) {
  const maxHeight = 150
  if (geometry) {
    map.getView().fit(geometry.getExtent(), {
      padding: [maxHeight, maxHeight, maxHeight, maxHeight],
      duration: 500,
    })
  }
}

export { attachSingleClickEvent }
