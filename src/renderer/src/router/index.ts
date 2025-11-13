import { createRouter, createWebHashHistory } from 'vue-router'
import HomeIndex from '@renderer/layouts/homeIndex.vue'
import ChromeIndex from '@renderer/layouts/chromeIndex.vue'
import ResourcesIndex from '@renderer/layouts/resourcesIndex.vue'
import MenuIndex from '@renderer/layouts/menuIndex.vue'
import downloadIndex from '@renderer/layouts/downloadIndex.vue'
import updateIndex from '@renderer/layouts/updateIndex.vue'
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: HomeIndex },
    { path: '/chrome', component: ChromeIndex },
    { path: '/resources', component: ResourcesIndex },
    { path: '/menu', component: MenuIndex },
    { path: '/download', component: downloadIndex },
    { path: '/update', component: updateIndex },
  ]
})
export default router
