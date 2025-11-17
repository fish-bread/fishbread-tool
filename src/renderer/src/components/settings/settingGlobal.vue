<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useGeneralStore } from '@renderer/func/pinia/generalPinia'
const generalStore = useGeneralStore()
const inputPort = ref<string>('')
import { useMessage } from 'naive-ui'
const message = useMessage()
const setPort = async (): Promise<void> => {
  try {
    window.api.setPort(inputPort.value)
    message.success('修改成功')
    generalStore.port = await window.api.getPort()
  } catch (e) {
    console.error(e)
    message.error('修改失败')
  }
}
const checkVersion = (): void => {
  message.loading('正在检查版本更新')
  window.updateApi.checkUpdate()
}
onMounted(() => {
  inputPort.value = generalStore.port
})
</script>

<template>
  <div class="page-settings">
    <h3 style="margin: 3px">全局设置</h3>
    <div class="port-setting">
      全局代理端口:&nbsp;{{ generalStore.port }}
      <n-input v-model:value="inputPort" placeholder="请输入修改端口号" style="max-width: 40%" />
      <n-button @click="setPort">修改全局端口</n-button>
    </div>
    <div class="port-setting">
      当前版本:&nbsp;{{ generalStore.version }}
      <n-button @click="checkVersion">检查版本</n-button>
    </div>
  </div>
</template>

<style scoped>
.page-settings {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.port-setting {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}
</style>
