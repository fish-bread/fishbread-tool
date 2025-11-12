<script setup lang="ts">
import downloadBox from '@renderer/components/download/downloadBox.vue'
import { onBeforeMount, onMounted, ref, computed } from 'vue'
import { sendTheme, theme } from '@renderer/func/themeChange'
import { downloadProgressInter } from '../../../types/downLoad'
onBeforeMount(() => {
  window.api.sendTheme(sendTheme)
})
const downloadProgressMap = ref(new Map<string, downloadProgressInter>())
// 根据 uuid 更新或添加下载项
const changeDownload = (item: downloadProgressInter): void => {
  downloadProgressMap.value.set(item.uuid, { ...item })
}
const downloadProgress = computed(() => {
  return Array.from(downloadProgressMap.value.values())
})
onMounted(() => {
  window.downloadApi.downloadItem(changeDownload)
})
</script>

<template>
  <div class="download-box" :data-theme="theme === null ? 'light' : 'dark'">
    <div
      class="app-drag move"
      :style="{
        borderBottom: theme === null ? '1px solid #4e4e4e' : '1px solid  #2c2c2c'
      }"
    >
      下载任务
    </div>
    <div class="download-in">
      <div v-show="downloadProgress.length === 0" class="download-text">还没有下载任务</div>
      <downloadBox v-show="downloadProgress.length > 0" :download-progress="downloadProgress" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.download-box {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  padding: 5px;
  overflow-y: auto;
}
.move {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 30px;
  font-weight: bold;
  font-size: 16px;
}
.download-text {
  font-size: 16px;
}
.download-in {
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
</style>
