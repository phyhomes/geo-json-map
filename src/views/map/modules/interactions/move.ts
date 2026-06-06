/**
 * @Project : geo-json-map
 * @Time    : 2026-06-05 10:28:37
 * @Author  : ZZQ
 * @Desc    : 处理鼠标移动事件
 */
import { Feature, Map } from 'ol'
import type { MoveEventOptions } from '@/views/map/modules/types'
import type FeatureLike from 'ol/Feature'
import * as olProj from 'ol/proj'
import { CENTER } from '@/views/map/modules/constants'
import { useMapStore } from '@/stores'
import { regionVertex } from '@/views/map/modules/services'
import { storeToRefs } from 'pinia'

// 处理鼠标移动事件
function attachMoveEvent(map: Map, opts: MoveEventOptions) {
  const mapStore = useMapStore()
  const { currLevel } = storeToRefs(mapStore)
  let lastFeature: Feature | null = null
  // 绑定鼠标移动事件
  map.on('pointermove', (event) => {
    // 如果当前是拖动行为，不处理
    if (event.dragging) return

    // 获取当前鼠标所在像素
    const pixel = event.pixel
    // 获取当前鼠标所在像素的所有feature
    const features = map.getFeaturesAtPixel(pixel, {
      // 过滤出当前层级的feature
      layerFilter: (layer) => layer.get('level') === currLevel.value,
      hitTolerance: 8,
    })

    if (features && features.length > 0) {
      const currentFeature = features[0] as FeatureLike

      // 如果当前feature和上一次的feature相同，则不处理
      if (currentFeature == lastFeature) return
      // 切换区域
      lastFeature = currentFeature
      const props = lastFeature.getProperties()
      const coordinate = olProj.fromLonLat(regionVertex.get(props.adcode) || CENTER)
      opts.popup.setPosition(coordinate)
      opts.popupCtrl.show()
      opts.popupData.name = props.name || ''
      opts.popupData.adcode = props.adcode || ''
      opts.popupData.level = props.level || ''

      // 鼠标变为 pointer
      const target = map.getTargetElement()
      if (target) {
        ;(target as HTMLElement).style.cursor = 'pointer'
      }
    } else {
      opts.popup.setPosition(undefined)
      opts.popupCtrl.hide()
      lastFeature = null

      // 恢复鼠标的默认样式
      const target = map.getTargetElement()
      if (target) {
        ;(target as HTMLElement).style.cursor = ''
      }
    }
  })
}

export { attachMoveEvent }
