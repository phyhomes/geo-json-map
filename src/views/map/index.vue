<template>
  <div class="home">
    <div id="map" class="map-home"></div>
    <MapPopup :data="popUpData" ref="mapPopupRef" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, useTemplateRef } from 'vue'
import { Map, View, Overlay } from 'ol'
import * as olProj from 'ol/proj'
import MapPopup from './modules/MapPopup.vue'
import {
  attachMoveEndEvent,
  attachMoveEvent,
  attachSingleClickEvent,
} from '@/views/map/modules/interactions'
import {
  chinaLayer,
  tileLayer,
  boundaryLayer,
  chinaSource,
  initBoundaryWatch,
} from '@/views/map/modules/layers'
import { loadRegionVertex } from '@/views/map/modules/services'
import { CENTER } from '@/views/map/modules'

const mapPopupRef = useTemplateRef('mapPopupRef')

// 弹窗数据
const popUpData = reactive({
  name: '',
  adcode: '',
  level: '',
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
      tileLayer,
      // 国界层
      boundaryLayer,
      // 各省（直辖市）填充层
      chinaLayer,
    ],
    view: new View({
      center: olProj.fromLonLat(CENTER),
      zoom: 1,
      maxZoom: 19,
    }),
    controls: [],
  })

  // 绑定鼠标移动事件 - 弹窗
  attachMoveEvent(openMap, {
    popup,
    popupCtrl: mapPopupRef.value!,
    popupData: popUpData,
  })

  // 绑定鼠标移动结束事件 - 重设中心点
  attachMoveEndEvent(openMap)

  // 绑定点击事件 - 下钻 | 上卷
  attachSingleClickEvent(openMap)

  // openMap.getView().on('change:resolution', () => {
  //   const zoom = openMap.getView().getZoom()!
  //   // console.log('当前层级：', zoom)
  // })
}

onMounted(() => {
  // 初始化地图
  initMap()
  // 初始化边界监听
  initBoundaryWatch()
  // 加载弹窗显示坐标数据
  loadRegionVertex(chinaSource)
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
