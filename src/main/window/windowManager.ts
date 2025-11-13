import { BrowserWindow, ipcMain } from 'electron'
import { closeChromeWindow } from '../chromeIpcMain/chrome/chromeFunc'
import { quitApply } from '../func/windowFunc'
export let menuWindow: BrowserWindow | null = null
export let mainWindow: BrowserWindow | null = null
export let chromeWindow: BrowserWindow | null = null
export let downloadWindow: BrowserWindow | null = null
export let updateWindow: BrowserWindow | null = null
export let resourcesWindow: resourcesWindowInter[] = []
interface resourcesWindowInter {
  BrowserWindow: BrowserWindow | null
  id: number
}
type windowName =
  | 'menuWindow'
  | 'mainWindow'
  | 'chromeWindow'
  | 'resourcesWindow'
  | 'downloadWindow'
  | 'updateWindow'
type closeWindowName =
  | 'menuWindow'
  | 'mainWindow'
  | 'chromeWindow'
  | 'downloadWindow'
  | 'updateWindow'
//窗体保存
export const saveWindow = (window: BrowserWindow, windowName: windowName): void => {
  switch (windowName) {
    case 'mainWindow':
      mainWindow = window
      break
    case 'menuWindow':
      menuWindow = window
      break
    case 'chromeWindow':
      chromeWindow = window
      break
    case 'downloadWindow':
      downloadWindow = window
      break
    case 'updateWindow':
      updateWindow = window
      break
    case 'resourcesWindow':
      resourcesWindow.push({
        BrowserWindow: window,
        id: window.id
      })
      break
  }
}
//窗体查询
export const readWindow = (windowName: windowName): BrowserWindow | null => {
  switch (windowName) {
    case 'mainWindow':
      return mainWindow
    case 'menuWindow':
      return menuWindow
    case 'chromeWindow':
      return chromeWindow
    case 'downloadWindow':
      return downloadWindow
    case 'updateWindow':
      return updateWindow
    default:
      return null
  }
}
//单独读取resourcesWindow
export const readResourcesWindow = (
  id: number,
  windowName: 'resourcesWindow'
): BrowserWindow | null => {
  switch (windowName) {
    case 'resourcesWindow':
      return resourcesWindow.find((item) => item.id === id)?.BrowserWindow || null
    default:
      return null
  }
}
//读取全部resourcesWindow
export const readAllResourcesWindow = (
  windowName: 'resourcesWindow'
): (BrowserWindow | null)[] | null => {
  switch (windowName) {
    case 'resourcesWindow':
      return resourcesWindow.map((item) => item.BrowserWindow)
    default:
      return null
  }
}
//单独关闭resourcesWindow
export const closeResourcesWindow = (id: number, windowName: 'resourcesWindow'): void => {
  switch (windowName) {
    case 'resourcesWindow':
      resourcesWindow = resourcesWindow.filter((item) => item.id !== id)
      break
  }
}
//使窗体为null
export const closeWindow = (windowName: closeWindowName): void => {
  switch (windowName) {
    case 'mainWindow':
      mainWindow = null
      break
    case 'menuWindow':
      menuWindow = null
      break
    case 'chromeWindow':
      chromeWindow = null
      break
    case 'downloadWindow':
      downloadWindow = null
      break
    case 'updateWindow':
      updateWindow = null
      break
  }
}
//检查窗体是否创建
export const windowIsCreate = (windowName: windowName): boolean => {
  //获取窗体,检查窗体是否创建
  const ElectronWindow = readWindow(windowName)
  if (windowName === 'downloadWindow' && ElectronWindow) {
    return true
  }
  if (ElectronWindow && ElectronWindow.isMinimized()) {
    ElectronWindow.restore()
    ElectronWindow.focus()
    return true
  } else if (ElectronWindow) {
    console.log('窗体已创建')
    ElectronWindow.focus()
    return true
  } else {
    return false
  }
}
//窗体ipc监听
export const registerWindowIpcHandlers = (): void => {
  //最大化或恢复窗体
  ipcMain.on('maxSizeFunc', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) {
      if (win && win.isMaximized()) win.unmaximize()
      else win.maximize()
    }
  })
  //最小化
  ipcMain.on('minimizeFunc', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) win.minimize()
  })
  //关闭
  ipcMain.on('closeWindowFunc', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender)
    if (win) {
      const chromeWin = readWindow('chromeWindow')
      const resources = readResourcesWindow(win.id, 'resourcesWindow')
      const download = readWindow('downloadWindow')
      const updateWindow = readWindow('updateWindow')
      switch (win.id) {
        case chromeWin?.id:
          closeChromeWindow()
          closeWindow('chromeWindow')
          break
        case 1:
          win.hide()
          break
        case download?.id:
          win.close()
          closeWindow('downloadWindow')
          break
        case resources?.id:
          win.close()
          closeResourcesWindow(win.id, 'resourcesWindow')
          break
        case updateWindow?.id:
          win.close()
          closeWindow('updateWindow')
      }
    }
  })
  //退出应用
  ipcMain.on('quitApplyFunc', async (): Promise<void> => {
    await quitApply()
  })
}
