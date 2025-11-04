import { BrowserWindow, ipcMain, app } from 'electron'
import { closeChromeWindow, chromeId } from '../chromeIpcMain/chrome/chromeFunc'
import { quitApply } from '../func/windowFunc'
export let menuWindow: BrowserWindow | null = null
export let mainWindow: BrowserWindow | null = null
//窗体保存
export const saveWindow = (
  window: BrowserWindow,
  windowName: 'menuWindow' | 'mainWindow'
): void => {
  switch (windowName) {
    case 'mainWindow':
      mainWindow = window
      break
    case 'menuWindow':
      menuWindow = window
      break
  }
}
//窗体查询
export const readWindow = (windowName: 'menuWindow' | 'mainWindow'): BrowserWindow | null => {
  switch (windowName) {
    case 'mainWindow':
      return mainWindow
    case 'menuWindow':
      return menuWindow
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
      if (win.id === chromeId) {
        closeChromeWindow()
      } else if (win.id === 1) {
        app.quit()
      } else {
        win.close()
      }
    }
  })
  //退出应用
  ipcMain.on('quitApplyFunc', async (): Promise<void> => {
    await quitApply()
  })
}
