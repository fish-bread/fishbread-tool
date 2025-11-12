import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import puppeteerLocalSettings, { PuppeteerSettingsApi } from '@renderer/func/puppeteerLocalSetting'
export const useDownloadStore = defineStore('downloadSetting', () => {
  const downloadPath = ref<string>('')
  const downloadCookie = ref<string>('')
  const downloadSettings = ref<puppeteerLocalSettings>()
  // 初始化 Pixiv 相关设置
  const initDownloadSettings = async (): Promise<void> => {
    const api: PuppeteerSettingsApi = {
      changeFilePath: window.downloadApi.setDownloadFilePath,
      restorePath: window.downloadApi.restoreDownloadFilePath,
      changeCookie: window.downloadApi.setDownloadCookie
    }
    downloadSettings.value = new puppeteerLocalSettings(api, downloadPath, downloadCookie)
    downloadPath.value = await window.downloadApi.getDownloadFilePath()
  }
  // 在 Store 内执行初始化
  onMounted(async () => {
    await initDownloadSettings()
  })
  return {
    // Pixiv 状态和方法
    downloadPath,
    downloadSettings,
    initDownloadSettings
  }
})
