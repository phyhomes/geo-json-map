/**
 * @Project : geo-json-map
 * @Time    : 2026-06-05 09:53:42
 * @Author  : ZZQ
 * @Desc    : 边界图层 国界 省界线
 */

import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import type { Feature } from 'ol'
import RenderFeature from 'ol/render/Feature'
import { getBoundaryStyleByType, leveBoundaryStyle } from '@/views/map/modules/layers'
import type { MapLevel } from '@/types'
import { useMapStore } from '@/stores/modules/map.ts'
import { watch } from 'vue'
import { storeToRefs } from 'pinia'

type FeatureLike = Feature | RenderFeature

/*
 * 国界层
 * 使用属性值curLevel来控制省界是否显示
 * curLevel 是 nation 则显示省界
 * curLevel 是 其它 则不显示省界
 * */
const boundaryLayer = new VectorLayer({
  source: new VectorSource({
    url: '/100000_boundary.json',
    format: new GeoJSON(),
  }),
  style: (feature: FeatureLike) => {
    const curLevel: MapLevel = boundaryLayer.get('curLevel')

    const type = feature.get('type')
    if (curLevel === 'nation') {
      return getBoundaryStyleByType(type)
    }

    if (['省界', '港澳'].includes(type)) return
    return getBoundaryStyleByType(type)
  },
  properties: { curLevel: 'nation' } satisfies { curLevel: MapLevel },
  // maxZoom: 10
})

function getLevelBoundaryLayer(feature: FeatureLike, level: MapLevel) {
  return new VectorLayer({
    source: new VectorSource({
      features: [feature],
    }),
    style: leveBoundaryStyle,
    properties: {
      level: 'boundary-' + level,
    },
  })
}

function refreshBoundaryLayer(level: MapLevel) {
  boundaryLayer.set('curLevel', level)
  boundaryLayer.getSource()?.changed()
}

function initBoundaryWatch() {
  const mapStore = useMapStore()
  const { currLevel } = storeToRefs(mapStore)

  /**
   * 侦听当前层级 控制样式
   */
  watch(
    currLevel,
    (newLevel, oldLevel) => {
      if (newLevel === 'nation' || oldLevel === 'nation') {
        // if (oldLevel === 'nation') {
        //   setTimeout(()=> {
        //     refreshBoundaryLayer(newLevel)
        //   }, 500)
        // } else {
        //   refreshBoundaryLayer(newLevel)
        // }
        refreshBoundaryLayer(newLevel)
      }
    },
    { immediate: true },
  )
}

export { boundaryLayer, getLevelBoundaryLayer, initBoundaryWatch }
