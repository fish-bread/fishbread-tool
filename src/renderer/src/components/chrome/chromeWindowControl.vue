<script setup lang="ts">
import Subtract20Regular from '@vicons/fluent/Subtract20Regular'
import Maximize20Regular from '@vicons/fluent/Maximize20Regular'
import Dismiss20Regular from '@vicons/fluent/Dismiss20Regular'
import AnimalCat20Regular from '@vicons/fluent/AnimalCat20Regular'
import ArrowDownload20Regular from '@vicons/fluent/ArrowDownload20Regular'
import { onMounted } from 'vue'
import { viewInter } from '../../../../types/mian'
import { ref } from 'vue'
const PageMessage = defineModel<viewInter[]>()
//默认浏览器
const pageBrowser = (tabId: number): void => window.chromeApi.pageBrowser(tabId)
//最大化
const maxSizeFunc = (): void => window.api.maxSizeFunc()
//最小化
const minimizeFunc = (): void => window.api.minimizeFunc()
//关闭
const closeWindowFunc = (): void => {
  PageMessage.value = []
  window.api.closeWindowFunc()
}
//打开下载任务菜单
const isShowDownload = ref<boolean>(false)
const downloadFunc = (): void => {
  window.downloadApi.openDownload(!isShowDownload.value)
  isShowDownload.value = !isShowDownload.value
}
const changeDownload = (bool: boolean): void => {
  isShowDownload.value = bool
}
defineProps<{
  iconSize: string
  activeId: number
}>()
onMounted(() => {
  window.downloadApi.downloadWindowClose(changeDownload)
})
</script>

<template>
  <div class="windows-drag">
    <!--浏览器-->
    <div
      class="control-button cursorPointer"
      title="使用默认浏览器打开"
      @click="pageBrowser(activeId)"
    >
      <n-icon :size="iconSize">
        <AnimalCat20Regular />
      </n-icon>
    </div>
    <!--下载-->
    <div class="control-button cursorPointer" title="下载任务" @click="downloadFunc">
      <n-icon :size="iconSize">
        <ArrowDownload20Regular />
      </n-icon>
    </div>
    <!--窗体控制-->
    <div class="control-button cursorPointer" @click="minimizeFunc">
      <n-icon :size="iconSize">
        <Subtract20Regular />
      </n-icon>
    </div>
    <div class="control-button cursorPointer" @click="maxSizeFunc">
      <n-icon :size="iconSize">
        <Maximize20Regular />
      </n-icon>
    </div>
    <div class="control-button cursorPointer close" @click="closeWindowFunc">
      <n-icon :size="iconSize">
        <Dismiss20Regular />
      </n-icon>
    </div>
  </div>
</template>

<style scoped lang="scss">
.windows-drag {
  display: flex;
  align-items: center;
  gap: 0;
  position: relative;
}
.control-button {
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  transition: all 0.2s ease;
  &:hover {
    background-color: var(--button-hover-color);
  }
}
.close {
  &:hover {
    background-color: #c42b1c !important;
  }
}
</style>
