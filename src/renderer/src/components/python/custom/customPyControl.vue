<script setup lang="ts">
import { useMessage } from 'naive-ui'
const message = useMessage()
import { useGeneralStore } from '@renderer/func/pinia/generalPinia'
const generalStore = useGeneralStore()
const choose_python = async (): Promise<void> => {
  const newPath = await window.pythonApi.choosePython()
  if (newPath.canceled) {
    generalStore.pythonPath = await window.pythonApi.getPythonPath()
    message.error('未选择python启动路径')
  } else {
    generalStore.pythonPath = newPath.filePath
    message.success('路径选择成功')
  }
}
const restore_python = async (): Promise<void> => {
  generalStore.pythonPath = await window.pythonApi.restorePythonPath()
  message.success('路径还原成功')
}
const python = (): void => {
  window.pythonApi.runCustomPython()
}
const kill_python = (): void => {
  window.pythonApi.killCustomPython()
}
</script>

<template>
  <div class="setting-container-column">
    <h3>自定义python控制台</h3>
    <div class="mini-flex">
      <n-button @click="python">启动python</n-button>
      <n-button @click="kill_python">killPython</n-button>
    </div>
  </div>
  <div class="setting-container-column">
    <h3>自定义文件运行路径</h3>
    <div class="mini-flex">
      <n-button @click="choose_python">选择python路径</n-button>
      <n-button @click="restore_python">还原python路径</n-button>
    </div>
  </div>
  <h4>注:自定义脚本须自行解决中文打印乱码的问题</h4>
  <h4>推荐转化为utf-8编码</h4>
</template>

<style scoped></style>
