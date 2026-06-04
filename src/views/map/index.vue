<template>
  <div class="home">
    <div id="map" class="map-home"></div>
    <MapMapPopup :data="popUpData" ref="mapPopupRef" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, useTemplateRef } from 'vue'
import { Map, View, Feature, Overlay } from 'ol'
import { Tile as TileLayer } from 'ol/layer'
import { Vector as VectorLayer } from 'ol/layer'
import { XYZ, Vector as VectorSource } from 'ol/source'
import * as olProj from 'ol/proj'
import { Point } from 'ol/geom'
import { Style, Fill, Stroke, Circle, Text } from 'ol/style'
import type FeatureLike from 'ol/Feature'
import type RenderFeature from 'ol/render/Feature'
import GeoJSON from 'ol/format/GeoJSON'
import MapMapPopup from './modules/MapPopup.vue'
import { boundaryLayer, getFullBoundaryLayer, loadVertex } from '@/views/map/modules/boundry.ts'
import { attachEvents, attachMoveEvents } from '@/views/map/modules/events.ts'

const mapPopupRef = useTemplateRef('mapPopupRef')
const provinceVertex = ref()
const popUpData = reactive({
  name: '',
  adcode: '',
  level: '',
})
type MyFeature = FeatureLike | RenderFeature

// 存储当前悬停的feature，用于恢复原始样式
let currentHoveredFeature: MyFeature | null = null
let originalStyle: Style | undefined | null = null

// Hover高亮样式
const hoverStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 200, 0, 0.4)',
  }),
  stroke: new Stroke({
    color: '#ff9800',
    width: 3,
  }),
})

const chinaLayer = new VectorLayer({
  source: new VectorSource({
    url: '/china.json',
    format: new GeoJSON(),
  }),
})

function initMap() {
  // 创建 Overlay 弹窗（只用来管理显示/隐藏，不依赖它的定位）
  const popup = new Overlay({
    element: mapPopupRef.value!.getElement(),
    stopEvent: false,
  })

  const openMap = new Map({
    target: 'map',
    overlays: [popup], // ✅ 注册弹窗到地图
    // 图层
    layers: [
      // 瓦片图
      new TileLayer({
        // 数据来源
        source: new XYZ({
          url: 'https://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}',
        }),
      }),
      getFullBoundaryLayer(),
      boundaryLayer,
      // 矢量图层
    ],
    view: new View({
      // 将西安作为地图中心
      center: olProj.fromLonLat([108.945951, 34.465262]),
      zoom: 1,
      maxZoom: 19,
    }),
    controls: [],
  })

  attachMoveEvents(openMap, {
    popup,
    popupCtrl: mapPopupRef.value!,
    popupData: popUpData,
  })

  openMap.on('singleclick', (event) => {
    console.log('单击事件')
    const map = openMap
    const pixel = event.pixel
    // 获取当前鼠标所在像素的所有feature
    const allFeatures = map.getFeaturesAtPixel(pixel, {
      hitTolerance: 8,
    }) as MyFeature[]

    // // 只筛选 Polygon / MultiPolygon（省份），忽略边界线
    // const features = allFeatures?.filter((f) => {
    //   console.log('当前的feature：', f)
    //   const parent = f.get('parent')
    //   console.log('当前的parent：', parent?.adcode)
    //   return parent && parent.adcode === 100000
    // })

    console.log('当前的features：', allFeatures)
  })

  openMap.getView().on('change:resolution', () => {
    const zoom = openMap.getView().getZoom()!
    // console.log('当前层级：', zoom)
  })
  attachEvents(openMap)
}

// function setMarker() {
//   let _style = new Style({
//     image: new Circle({
//       radius: 10,
//       // 边框
//       stroke: new Stroke({
//         color: '#fff',
//         width: 1,
//       }),
//       // 填充样式
//       fill: new Fill({
//         color: '#3399CC',
//       }),
//     }),
//   })
//   let _feature = new Feature({
//     geometry: new Point(olProj.fromLonLat([108.945951, 34.465262])),
//   })
//   _feature.setStyle(_style)
//   let _marker = new VectorLayer({
//     source: new VectorSource({
//       features: [_feature],
//     }),
//   })
//   openMap.value.addLayer(_marker)
// }

// 恢复原始样式
function restoreOriginalStyle() {
  if (currentHoveredFeature) {
    if (originalStyle) {
      currentHoveredFeature.setStyle(originalStyle)
    } else {
      currentHoveredFeature.setStyle(undefined)
    }
  }
}

onMounted(() => {
  initMap()
  // setMarker()
  provinceVertex.value = loadVertex()
})
</script>
<style scoped>
.home {
  width: 100%;
  height: 100%;
}
.map-home {
  height: 100%;
}
</style>
