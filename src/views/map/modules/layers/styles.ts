/**
 * @Project : geo-json-map
 * @Time    : 2026-06-05 09:56:25
 * @Author  : ZZQ
 * @Desc    : 图层样式定义
 */
import { Fill, Stroke, Style } from 'ol/style'

/**
 * 中国地图各边界的样式
 * @param type 类型： 国界 | 省界 | 港澳 | 海洋 | 争议
 */
function getBoundaryStyleByType(type: string): Style {
  switch (type) {
    case '国界':
      return new Style({
        stroke: new Stroke({
          color: '#d60e3d',
          width: 2,
        }),
      })
    case '争议':
      return new Style({
        stroke: new Stroke({
          color: '#d60e3d',
          width: 2,
          lineDash: [6, 6],
          lineCap: 'round',
        }),
      })
    case '海洋':
      return new Style({
        stroke: new Stroke({
          color: '#0099ff',
          width: 1,
          lineDash: [6, 6],
          lineCap: 'round',
        }),
      })
    // 省界样式
    default:
      return new Style({
        stroke: new Stroke({
          color: 'rgb(44 44 44 / 0.8)',
          width: 1,
          lineDash: [6, 6],
          lineCap: 'round',
        }),
      })
  }
}

/**
 * 各行政级别的样式 用虚线
 * @param drillAble 是否可下钻
 */
function getLevelStyle(drillAble: boolean) {
  // 可下钻的为虚线
  if (drillAble) {
    return new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.1)',
      }),
      stroke: new Stroke({
        color: '#070606',
        width: 0.5,
        lineDash: [6, 6],
        lineDashOffset: 0,
        lineCap: 'round',
      }),
    })
  }

  // 不可下钻的为实线
  return new Style({
    fill: new Fill({
      color: 'rgba(255, 255, 255, 0.1)',
    }),
    stroke: new Stroke({
      color: '#070606',
      width: 2,
    }),
  })
}

// 中国各省（市）填充图层样式
const chinaLayerStyle = new Style({
  fill: new Fill({
    color: 'rgb(243 243 243 / 0.6)',
  }),
})

/**
 * 各行政级别的轮廓样式
 */
const leveBoundaryStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.1)',
  }),
  stroke: new Stroke({
    color: '#070606',
    width: 1.25,
  }),
})

export { getBoundaryStyleByType, getLevelStyle, chinaLayerStyle, leveBoundaryStyle }
