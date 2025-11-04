<script setup lang="ts">
import { inject, Ref, ref } from 'vue'
import { useGeneralStore } from '@renderer/func/pinia/generalPinia'
const generalStore = useGeneralStore()
const time = inject<Ref<string>>('time', ref(''))
const href = ref('')
const headless = ref<boolean>(true)
const deleteChoose = ref<boolean>(true)
const runPuppeteer = (): void => {
  window.bilibiliApi.runBilibiliPuppeteer({
    time: Number(time.value),
    href: href.value,
    headless: headless.value,
    useProxy: false,
    port: generalStore.port,
    deleteChoose: deleteChoose.value
  })
}
const killPuppeteer = (): void => {
  window.bilibiliApi.killBilibiliPuppeteer()
}
</script>

<template>
  <div class="bili-control">
    <div class="setting-container-column">
      <h3>bilibili爬虫控制台</h3>
      <div class="mini-flex">
        <n-button @click="runPuppeteer">运行bilibili脚本</n-button>
        <n-button @click="killPuppeteer">killBilibili脚本</n-button>
      </div>
    </div>
    <div class="setting">
      <div class="setting-box">
        <h3>无头模式</h3>
        <n-switch v-model:value="headless" />
      </div>
      <div class="setting-box">
        <h3>下载后删除原音频和视频文件</h3>
        <n-switch v-model:value="deleteChoose" />
      </div>
    </div>
    <h3>bilibili视频或bv号网址</h3>
    <n-input v-model:value="href" placeholder="请输入你想搜索的bv号视频"></n-input>
    <div>注: 请确保cookie未过期,过期或无效cookie可能会导致视频清晰度较低</div>
  </div>
</template>

<style scoped>
.setting {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  gap: 10px;
}
</style>
