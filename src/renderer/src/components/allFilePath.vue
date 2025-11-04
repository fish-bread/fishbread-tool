<script setup lang="ts">
import { inject, onMounted, ref, Ref, watch } from 'vue'
import { useGeneralStore } from '@renderer/func/pinia/generalPinia'
const generalStore = useGeneralStore()
const path = ref<string>('')
const pathName = inject<Ref<string>>('pathName')
onMounted(() => {
  switch (pathName?.value) {
    case 'python':
      path.value = generalStore.pythonPath
      break
    case '自定义python':
      path.value = generalStore.pythonPath
      break
    case '谷歌浏览器':
      path.value = generalStore.puppeteerChromePath
      break
  }
})
watch(
  () => pathName?.value,
  (newVal) => {
    switch (newVal) {
      case 'python':
        path.value = generalStore.pythonPath
        break
      case '自定义python':
        path.value = generalStore.pythonPath
        break
      case '谷歌浏览器':
        path.value = generalStore.puppeteerChromePath
        break
    }
  },
  {
    deep: true,
  }
)
watch(
  () => generalStore.pythonPath,
  (newVal) => {
    path.value = newVal
  }
)
watch(
  () => generalStore.puppeteerChromePath,
  (newVal) => {
    path.value = newVal
  }
)
</script>

<template>
  <n-tooltip :show-arrow="false" trigger="hover">
    <template #trigger>
      <div class="file-path">&nbsp;{{ pathName }}启动路径:&nbsp;{{ path }}</div>
    </template>
    {{ path }}
  </n-tooltip>
</template>

<style scoped>
.file-path {
  height: 23px;
  box-sizing: border-box;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
}
</style>
