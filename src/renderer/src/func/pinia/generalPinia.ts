import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
export const useGeneralStore = defineStore('generalSetting', () => {
  const port = ref<string>('')
  const puppeteerChromePath = ref<string>('')
  const pythonPath = ref<string>('')
  onMounted(async () => {
    port.value = await window.api.getPort()
    puppeteerChromePath.value = await window.api.getChromePath()
  })
  return {
    port,
    pythonPath,
    puppeteerChromePath
  }
})
