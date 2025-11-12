<script setup lang="ts">
import { inject, Ref, ref } from 'vue'
import { useMessage } from 'naive-ui'
const message = useMessage()
import { useGeneralStore } from '@renderer/func/pinia/generalPinia'
const generalStore = useGeneralStore()
//注入
const time = inject<Ref<string>>('time', ref(''))
const href = ref('')
const headless = ref<boolean>(true)
const agent = ref<boolean>(true)
//运行puppeteer
const runPuppeteer = async (): Promise<void> => {
  if (href.value === '') {
    message.error('连接为空')
    return
  }
  await window.pixivApi.runPuppeteer({
    time: Number(time.value),
    href: href.value,
    headless: headless.value,
    useProxy: agent.value,
    port: generalStore.port
  })
}
//killPuppeteer
const killPuppeteer = async (): Promise<void> => {
  await window.pixivApi.killPuppeteer()
}
</script>

<template>
  <div class="home-control">
    <div class="setting-container-column">
      <h3>pixiv控制台</h3>
      <div class="mini-flex">
        <n-button @click="runPuppeteer">运行pixiv脚本</n-button>
        <n-button @click="killPuppeteer">killPixiv脚本</n-button>
      </div>
    </div>
    <div class="setting">
      <div class="setting-box">
        <h3>无头模式</h3>
        <n-switch v-model:value="headless" />
      </div>
      <div class="setting-box">
        <h3>网络代理</h3>
        <n-switch v-model:value="agent" />
        <div class="agent">
          端口:
          <div style="max-width: 70px">{{ generalStore.port }}</div>
        </div>
      </div>
    </div>
    <h3>pixiv的图片pid/图片网址</h3>
    <n-input v-model:value="href" placeholder="请输入你想搜索的图片pid"></n-input>
    <div>
      注: 请确保cookie未过期,过期或无效cookie可能会导致图片爬取不完整较低,请确保开启网络代理
    </div>
  </div>
</template>

<style scoped>
.setting {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  gap: 10px;
}
.agent {
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
