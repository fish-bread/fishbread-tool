<script setup lang="ts">
import { inject, ref, Ref } from 'vue'
import { allMessageInter } from '../../../../types/mian'
import { useMessage } from 'naive-ui'
const message = useMessage()
import { useGeneralStore } from '@renderer/func/pinia/generalPinia'
const generalStore = useGeneralStore()
//注入
const mess = inject<Ref<allMessageInter[]>>('mess')
const time = inject<Ref<string>>('time', ref(''))
//选择浏览器
const choose_chrome = async (): Promise<void> => {
  const newPath = await window.api.changePuppeteer()
  if (newPath.canceled) {
    generalStore.puppeteerChromePath = await window.api.getChromePath()
    message.error('未选择python启动路径')
  } else {
    console.log('文件路径', newPath)
    generalStore.puppeteerChromePath = newPath.filePath
    message.success('路径选择成功')
  }
}
//重置浏览器
const restore_chrome = async (): Promise<void> => {
  generalStore.puppeteerChromePath = await window.api.restorePuppeteerPath()
  message.success('路径还原成功')
}
//清除控制台
const clean_puppeteer = (): void => {
  if (mess) {
    mess.value = []
    message.success('python控制台已清空')
  }
}
</script>

<template>
  <div>
    <div class="setting-container">
      <h3>puppeteer打印台</h3>
      <n-button pr @click="clean_puppeteer">清除打印台</n-button>
    </div>
    <div class="setting-container-column">
      <h3>puppeteer浏览器启动路径</h3>
      <div class="mini-flex">
        <n-button @click="choose_chrome">选择浏览器路径</n-button>
        <n-button @click="restore_chrome">还原浏览器路径</n-button>
      </div>
    </div>
    <h3>脚本预启动时间</h3>
    <n-input v-model:value="time" placeholder="请输入puppeteer预启动时间,默认3秒"></n-input>
  </div>
</template>

<style scoped></style>
