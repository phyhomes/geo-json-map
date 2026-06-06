/**
 * @Project : geo-json-map
 * @Time    : 2026-06-05 10:49:54
 * @Author  : ZZQ
 * @Desc    : map全局状态
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { MapLevel } from '@/types'

export const useMapStore = defineStore('map', () => {
  // 当前的行政级别
  const currLevel = ref<MapLevel>('nation')

  return {
    currLevel,
  }
})
