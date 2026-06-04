<template>
  <div
    ref="popupRef"
    class="gi-popup atlas-map-popup gi-popup-anchor-bottom"
    style="--popup-border-color: transparent"
  >
    <div class="gi-popup-tip"></div>
    <div class="gi-popup-content">
      <div class="map-popup-content">
        <div class="map-popup-content-items">
          <div class="map-popup-item">
            <span class="map-popup-item-key">adcode:</span>
            <span class="map-popup-item-value">{{ data.adcode }}</span>
          </div>
          <div class="map-popup-item">
            <span class="map-popup-item-key">name:</span>
            <span class="map-popup-item-value">{{ data.name }}</span>
          </div>
          <div class="map-popup-item">
            <span class="map-popup-item-key">level:</span>
            <span class="map-popup-item-value">{{ data.level }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import type { PopupData } from '@/types'

const popupRef = useTemplateRef('popupRef')

interface Props {
  // 弹窗数据
  data: PopupData
}

const { data } = defineProps<Props>()

/** 获取弹窗 DOM 元素（供父组件创建 Overlay 使用） */
function getElement() {
  return popupRef.value!
}

/** 显示弹窗并定位到指定坐标 */
function show() {
  const el = popupRef.value!
  el.style.display = 'flex'
  // 用 setTimeout(0) 确保 DOM 已渲染后再修正 transform
  setTimeout(() => {
    el.style.transform = 'translate(-50%, calc(-100% - 12px))'
  }, 0)
}

/** 隐藏弹窗并重置状态 */
function hide() {
  const el = popupRef.value!
  el.style.display = 'none'
}

defineExpose({ getElement, show, hide })
</script>

<style scoped>
.gi-popup {
  display: none;
  pointer-events: none;
  position: absolute;
  z-index: 100;
}

.atlas-map-popup {
  background-color: #fff;
  border-radius: 8px;
  box-shadow:
    0 2px 16px rgba(0, 0, 0, 0.15),
    0 0 1px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--popup-border-color, #e8e8e8);
  padding: 12px 20px;
  max-width: none;
  width: max-content;
}

.gi-popup-anchor-bottom .gi-popup-tip {
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-top: 12px solid #fff;
}

.gi-popup-anchor-bottom .gi-popup-tip::before {
  content: '';
  position: absolute;
  top: -16px;
  left: -14px;
  width: 0;
  height: 0;
  border-left: 16px solid transparent;
  border-right: 16px solid transparent;
  border-top: 16px solid #fff;
}

.gi-popup-content {
  position: relative;
  z-index: 1;
}

.map-popup-content-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.map-popup-item {
  display: flex;
  align-items: baseline;
  font-size: 13px;
  line-height: 1.5;
}

.map-popup-item-key {
  color: #999;
  margin-right: 8px;
  white-space: nowrap;
  min-width: 60px;
}

.map-popup-item-value {
  color: #333;
  font-weight: 500;
}
</style>
