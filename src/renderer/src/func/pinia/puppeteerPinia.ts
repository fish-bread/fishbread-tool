import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import puppeteerLocalSettings, { PuppeteerSettingsApi } from '@renderer/func/puppeteerLocalSetting'
export const useLocalStore = defineStore('localSetting', () => {
  // Pixiv 状态
  const pixivPath = ref<string>('')
  const pixivCookie = ref<string>('')
  const pixivSettings = ref<puppeteerLocalSettings>()

  // Bilibili 状态
  const bilibiliPath = ref<string>('')
  const bilibiliCookie = ref<string>('')
  const bilibiliSettings = ref<puppeteerLocalSettings>()

  // 初始化 Pixiv 相关设置
  const initPixivSettings = async (): Promise<void> => {
    const api: PuppeteerSettingsApi = {
      changeFilePath: window.pixivApi.changePixivFilePath,
      restorePath: window.pixivApi.restorePixivPath,
      changeCookie: window.pixivApi.changePixivCookie
    }
    pixivSettings.value = new puppeteerLocalSettings(api, pixivPath, pixivCookie)
    pixivPath.value = await window.pixivApi.getPixivFilePath()
    pixivCookie.value = await window.pixivApi.getPixivCookie()
  }

  // 初始化 Bilibili 相关设置
  const initBilibiliSettings = async (): Promise<void> => {
    const api: PuppeteerSettingsApi = {
      changeFilePath: window.bilibiliApi.setBilibiliFilePath,
      restorePath: window.bilibiliApi.restoreBilibiliFilePath,
      changeCookie: window.bilibiliApi.setBilibiliCookie
    }
    bilibiliSettings.value = new puppeteerLocalSettings(api, bilibiliPath, bilibiliCookie)
    bilibiliPath.value = await window.bilibiliApi.getBilibiliFilePath()
    bilibiliCookie.value = await window.bilibiliApi.getBilibiliCookie()
  }

  // 在 Store 内执行初始化
  onMounted(async () => {
    await initPixivSettings()
    await initBilibiliSettings()
  })

  return {
    // Pixiv 状态和方法
    pixivPath,
    pixivCookie,
    pixivSettings,
    initPixivSettings,
    // Bilibili 状态和方法
    bilibiliPath,
    bilibiliCookie,
    bilibiliSettings,
    initBilibiliSettings
  }
})
