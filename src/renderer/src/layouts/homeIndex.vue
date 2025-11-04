<script setup lang="ts">
import Sidebar from '@renderer/components/sidebar/homeSidebar.vue'
import HomePage from '@renderer/components/home/homePage.vue'
import PythonPage from '@renderer/components/python/pythonPage.vue'
import ScriptPage from '@renderer/components/Script/scriptPage.vue'
import SettingPage from '@renderer/components/settings/settingsPage.vue'
import toolPage from '@renderer/components/tool/toolPage.vue'
import { ref, provide, onBeforeMount } from 'vue'
import HeaderIndex from '@renderer/components/headerIndex.vue'
import { sendTheme } from '@renderer/func/themeChange'
const PyComponents = [HomePage, PythonPage, ScriptPage, toolPage, SettingPage]
const num = ref<number>(0)
provide('HomeComponentNum', num)
onBeforeMount(() => {
  window.api.sendTheme(sendTheme)
})
</script>

<template>
  <HeaderIndex />
  <div class="home-page">
    <Sidebar></Sidebar>
    <KeepAlive>
      <component :is="PyComponents[num]" />
    </KeepAlive>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: row;
}
</style>
