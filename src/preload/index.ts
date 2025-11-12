import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { pythonApi } from './pythonApi'
import { PuppeteerPixivApi } from './puppeteerPixivApi'
import { outPutApi } from './outputApi'
import { globalSettingApi } from './globalSettingApi'
import { puppeteerBilibiliApi } from './puppeteerBilibiliApi'
import { chromeApi } from './chromeApi'
import { globalPuppeteerApi } from './globalPuppeteerApi'
import { sharpApi } from './sharpApi'
import { ru34Api } from './ru34Api'
import { resourcesApi } from './resourcesApi'
import { windowApi } from './windowApi'
import { downloadApi } from './downloadApi'

// Custom APIs for renderer
const api = {
  ...outPutApi,
  ...globalSettingApi,
  ...globalPuppeteerApi,
  ...resourcesApi,
  ...windowApi,
  pathToFileURL: (filePath: string) => ipcRenderer.invoke('path-to-file-url', filePath) //文件
}
// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('chromeApi', chromeApi)
    contextBridge.exposeInMainWorld('pythonApi', pythonApi)
    contextBridge.exposeInMainWorld('pixivApi', PuppeteerPixivApi)
    contextBridge.exposeInMainWorld('bilibiliApi', puppeteerBilibiliApi)
    contextBridge.exposeInMainWorld('sharpApi', sharpApi)
    contextBridge.exposeInMainWorld('ru34Api', ru34Api)
    contextBridge.exposeInMainWorld('downloadApi', downloadApi)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  window.chromeApi = chromeApi
  window.pythonApi = pythonApi
  window.pixivApi = PuppeteerPixivApi
  window.bilibiliApi = puppeteerBilibiliApi
  window.sharpApi = sharpApi
  window.ru34Api = ru34Api
  window.downloadApi = downloadApi
}
