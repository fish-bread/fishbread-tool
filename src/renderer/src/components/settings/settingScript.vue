<script setup lang="ts">
import { computed } from 'vue'
import puppeteerLocalSettings from '@renderer/func/puppeteerLocalSetting'
const path = defineModel<string>('path')
const cookie = defineModel<string>('cookie')
const settings = defineModel<puppeteerLocalSettings | null>('settings')
const title = defineModel<string>('title')
const safeChangeCookie = computed({
  get: () => settings.value?.changeCookie?.value || '', // 安全获取值
  set: (val) => {
    if (settings.value) {
      settings.value.changeCookie.value = val
    }
  }
})
</script>

<template>
  <div class="puppeteer-setting">
    <h3>{{ title }}爬虫设置</h3>
    <div class="pixiv-cookie">
      <n-tooltip :show-arrow="false" trigger="hover">
        <template #trigger>
          <div class="pixiv-cookie-view">{{ title }}的cookie:&nbsp;&nbsp;{{ cookie }}</div>
        </template>
        {{ cookie }}
      </n-tooltip>
      <n-input
        v-model:value="safeChangeCookie"
        :placeholder="`请输入${title}Cookie`"
        style="max-width: 50%"
      />
      <n-button @click="settings?.changeCookieFunc">更换cookie</n-button>
    </div>
    <div class="path">
      {{ title }}图片保存文件路径:&nbsp;&nbsp;{{ path }}
      <n-button @click="settings?.changeFilePathFunc">修改文件路径</n-button>
      <n-button @click="settings?.restoreFilePathFunc">恢复默认路径</n-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.path {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
}
.pixiv-cookie {
  max-width: 1000px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  overflow: hidden;
  white-space: nowrap;
  .pixiv-cookie-view {
    max-width: 500px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
