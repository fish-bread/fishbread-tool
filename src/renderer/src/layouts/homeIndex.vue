<script setup lang="ts">
import Sidebar from '@renderer/components/sidebar/homeSidebar.vue'
import HomePage from '@renderer/components/home/homePage.vue'
import PythonPage from '@renderer/components/python/pythonPage.vue'
import ScriptPage from '@renderer/components/Script/scriptPage.vue'
import SettingPage from '@renderer/components/settings/settingsPage.vue'
import toolPage from '@renderer/components/tool/toolPage.vue'
import { ref, provide, onBeforeMount, onMounted } from 'vue'
import HeaderIndex from '@renderer/components/headerIndex.vue'
import { sendTheme } from '@renderer/func/themeChange'
import { useMessage } from 'naive-ui'
import { updateMessageInter } from '../../../types/update'
const message = useMessage()
const PyComponents = [HomePage, PythonPage, ScriptPage, toolPage, SettingPage]
const num = ref<number>(0)
provide('HomeComponentNum', num)
onBeforeMount(() => {
  window.api.sendTheme(sendTheme)
  window.updateApi.updateMessage(updateMessage)
})
//检查更新
const checkUpdateFunc = (): void => {
  message.loading('正在检查版本更新')
  window.updateApi.checkUpdate()
}
const updateMessage = (info: updateMessageInter): void => {
  switch (info.status) {
    case 'success':
      message.success(info.message)
      break
    case 'error':
      message.error('检查新版本失败,请检查网络')
      break
    case 'update':
      message.info(info.message)
      break
  }
}
onMounted(async () => {
  checkUpdateFunc()
})
</script>

<template>
  <div class="all-page">
    <HeaderIndex />
    <div class="home-page">
      <Sidebar></Sidebar>
      <KeepAlive>
        <component :is="PyComponents[num]" />
      </KeepAlive>
    </div>
  </div>
</template>

<style scoped lang="scss">
.all-page {
  display: flex;
  flex-direction: column;
  position: relative;
  .home-page {
    display: flex;
    flex-direction: row;
  }
}

</style>
