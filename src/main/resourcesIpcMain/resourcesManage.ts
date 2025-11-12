import { ipcMain } from 'electron'
import { createResourcesWindow } from '../window/resourcesWindow'
import { sendPost } from '../../types/ru34'
import { createDownloadWindow } from '../window/downloadWindow'
export const registerResourcesIpcHandlers = (): void => {
  //打开资源页面
  ipcMain.on('show-resources', (_event, filePath: sendPost): void => {
    createResourcesWindow(filePath)
    createDownloadWindow()
  })
}
