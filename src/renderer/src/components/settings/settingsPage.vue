<!-- 您的设置页面组件 -->
<script setup lang="ts">
import settingScript from '@renderer/components/settings/settingScript.vue'
import settingsGlobal from '@renderer/components/settings/settingGlobal.vue'
import settingPython from '@renderer/components/settings/settingPython.vue'
import pageControl from '@renderer/components/pageControl.vue'
import { ref } from 'vue'
import { useLocalStore } from '@renderer/func/pinia/puppeteerPinia'
import { settingTitle } from '../../../../types/mian'
import { pageTitleInter } from '../../../../types/renderer'
const localStore = useLocalStore()

// 标题定义
const title = ref<settingTitle>({
  pixiv: 'pixiv',
  bilibili: 'bilibili'
})

// 页面切换设置
const setting_title = ref<pageTitleInter[]>([
  { title: '全局设置', value: 0 },
  { title: 'python设置', value: 1 },
  { title: 'pixiv设置', value: 2 },
  { title: 'bilibili设置', value: 3 }
])
const num = ref<number>(0)
</script>

<template>
  <div class="setting-page">
    <pageControl v-model:num="num" v-model:title="setting_title" />
    <div class="scroll-box">
      <settingsGlobal v-show="num === 0" />
      <settingPython v-show="num === 1" />
      <!-- 使用 Store 中的状态 -->
      <settingScript
        v-show="num === 2"
        v-model:title="title.pixiv"
        v-model:path="localStore.pixivPath"
        v-model:cookie="localStore.pixivCookie"
        v-model:settings="localStore.pixivSettings"
      />
      <settingScript
        v-show="num === 3"
        v-model:title="title.bilibili"
        v-model:path="localStore.bilibiliPath"
        v-model:cookie="localStore.bilibiliCookie"
        v-model:settings="localStore.bilibiliSettings"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.scroll-box {
  box-sizing: border-box;
  height: calc(100vh - 50px);
  overflow: auto;
  padding-left: 10px;
}
</style>
