import '@renderer/style/main.css'
import '@renderer/style/printIndex.css'
import '@renderer/style/tabsIndex.css'
import '@renderer/style/sidebarButton.css'

import { createApp } from 'vue'
import router from './router'
import { createPinia } from 'pinia'
import App from './App.vue'
import VueDOMPurifyHTML from 'vue-dompurify-html'
const app = createApp(App)

app.use(router)
app.use(VueDOMPurifyHTML)
app.use(createPinia())
app.mount('#app')
