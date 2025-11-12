<script setup lang="ts">
import puppeteerLocalSettings from '@renderer/func/puppeteerLocalSetting'

const path = defineModel<string>('path')
const settings = defineModel<puppeteerLocalSettings | null>('settings')
</script>

<template>
  <div class="puppeteer-setting">
    <h2>全局设置</h2>
    <div class="port-setting">
      <div class="path">
        <n-tooltip :show-arrow="false" trigger="hover">
          <template #trigger>
            <div class="pixiv-cookie-view">文件下载路径:&nbsp;&nbsp;{{ path }}</div>
          </template>
          {{ path }}
        </n-tooltip>
        <n-button @click="settings?.changeFilePathFunc">修改文件路径</n-button>
        <n-button @click="settings?.restoreFilePathFunc">恢复默认路径</n-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.path {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  .pixiv-cookie-view {
    max-width: 700px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
