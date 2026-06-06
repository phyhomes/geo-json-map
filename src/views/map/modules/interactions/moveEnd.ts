/**
 * @Project : geo-json-map
 * @Time    : 2026-06-05 15:14:22
 * @Author  : ZZQ
 * @Desc    : 处理拖动结束事件
 */

import { Map } from 'ol'

/**
 * 解决无缝拖动问题 参考渡一前端课
 * @param map
 */
function attachMoveEndEvent(map: Map) {
  map.on('moveend', () => {
    const view = map.getView()
    const center = view.getCenter()!
    const extend = view.getProjection().getExtent()
    const worldWidth = extend[2]! - extend[0]!
    const x = center[0]!
    // 重设中心点
    view.setCenter([
      ((((x - extend[0]!) % worldWidth) + worldWidth) % worldWidth) + extend[0]!,
      center[1]!,
    ])
  })
}

export { attachMoveEndEvent }
