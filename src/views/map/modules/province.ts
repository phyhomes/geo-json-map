/**
 * @Project : vue-map-test
 * @Time    : 2026-06-01 10:41:13
 * @Author  : ZZQ
 * @Desc    : todo
 */
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { Fill, Stroke, Style } from 'ol/style'

export function getLevelLayer(level: string, adcode: string) {
  // let namedLevel: string
  // switch (level) {
  //   case 'province':
  //     namedLevel = 'city'
  //     break
  //   case 'city':
  //     namedLevel = 'county'
  //     break
  //   case 'county':
  //     namedLevel = 'district'
  //     break
  //   default:
  //     throw new Error(`Invalid level: ${level}`)
  // }

  return new VectorLayer({
    source: new VectorSource({
      url: `/${level}/${adcode}.json`,
      format: new GeoJSON(),
    }),
    style: new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.1)',
      }),
      stroke: new Stroke({
        color: '#070606',
        width: 1.5,
        // lineDash: [6, 6],
        // lineDashOffset: 0,
        // lineCap: 'round',
      }),
    }),
    properties: {
      level: level,
    },
  })
}
