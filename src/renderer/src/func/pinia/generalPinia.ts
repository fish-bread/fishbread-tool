import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
export const useGeneralStore = defineStore('generalSetting', () => {
  const port = ref<string>('')
  const version = ref<string>('')
  const puppeteerChromePath = ref<string>('')
  const pythonPath = ref<string>('')
  onMounted(async () => {
    port.value = await window.api.getPort()
    version.value = await window.api.getVersion()
    puppeteerChromePath.value = await window.api.getChromePath()
  })
  return {
    port,
    version,
    pythonPath,
    puppeteerChromePath
  }
})
