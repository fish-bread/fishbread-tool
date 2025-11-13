<script setup lang="ts">
import { onBeforeMount, onMounted, ref } from 'vue'
import { sendTheme } from '@renderer/func/themeChange'
import Dismiss20Regular from '@vicons/fluent/Dismiss20Regular'
//关闭
const closeWindowFunc = (): void => {
  window.api.closeWindowFunc()
}
//确认下载
const isUpdate = ref<boolean>(false)
const downloadUpdate = (): void => {
  installApp.value = true
  window.updateApi.downloadUpdate()
}
//监听下载进度
const proValue = ref<number>(0)
const downloadProgress = (progress: number): void => {
  proValue.value = progress
}
//监听是否成功下载
const installApp = ref<boolean>(false)
const sendUpdateWindowUpdateMessageFunc = (message: boolean): void => {
  installApp.value = message
}
//更新app
const updateApp = (): void => {
  window.updateApi.updateApp()
}
onBeforeMount(() => {
  window.api.sendTheme(sendTheme)
  window.updateApi.sendUpdateWindowUpdateMessage(sendUpdateWindowUpdateMessageFunc)
})
onMounted(() => {
  window.updateApi.updateProgress(downloadProgress)
})
</script>

<template>
  <div class="update-page">
    <!--关闭窗体-->
    <div class="control-button cursorPointer close" title="关闭窗体" @click="closeWindowFunc">
      <n-icon size="30">
        <Dismiss20Regular />
      </n-icon>
    </div>
    <div class="update-box">
      <h2 style="margin: 2px 0">请确认更新</h2>
      <div class="check-button">
        <n-button @click="downloadUpdate">确认</n-button>
        <n-button @click="closeWindowFunc">取消</n-button>
      </div>
      <div v-show="isUpdate" class="download-update">
        <n-progress style="width: 100%" :percentage="proValue" />
        <n-button v-show="installApp" @click="updateApp">确认更新</n-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.update-page {
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  border-radius: 10px;
  padding: 5px 5px;
  position: relative;
}
.update-box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .check-button {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
  .download-update {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
}
.control-button {
  position: absolute;
  top: 5px;
  right: 5px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 30px;
  transition: all 0.2s ease;
  border-radius: 5px;
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
