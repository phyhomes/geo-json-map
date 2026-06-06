import { createApp } from 'vue'
import { initStore } from '@/stores'

import App from './App.vue'

const app = createApp(App)
// 初始化状态管理
initStore(app)

app.mount('#app')
