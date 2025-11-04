import { app, BrowserWindow, protocol } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { getLock } from './func/gotTheLock'
import { registerPythonIpcHandlers } from './pythonIpcMian/pythonProcessManager'
import { registerPixivPuppeteerIpcHandlers } from './puppeteerIpcMain/puppeteerPixivProcessManager'
import { registerCustomPythonIpcHandlers } from './pythonIpcMian/pythonCustomManager'
import { allSettingManager } from './manager/allSettingManager'
import { registerBilibiliPuppeteerIpcHandlers } from './puppeteerIpcMain/puppeteerBilibiliProcessManager'
import { createWindow } from './window/mainWindow'
import { registerChromeIpcHandlers } from './chromeIpcMain/chromeManager'
import { sharpIpcHandlers } from './tool/sharp/sharpManager'
import { localFileProtocol } from './func/localFileProtocol'
import { ru34IpcHandlers } from './tool/ru34/ru34Manage'
import { registerResourcesIpcHandlers } from './resourcesIpcMain/resourcesManage'
import { TrayManager } from './tary/trayManager'
import { readWindow, registerWindowIpcHandlers } from './window/windowManager'
// 检测并阻止多实例
getLock()
// 注册自定义协议
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'safe-local',
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: true,
      corsEnabled: true,
      stream: true
    }
  }
])
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  //注册自定义协议
  localFileProtocol()
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  // IPC 中间件
  //airtest的ipc函数
  registerPythonIpcHandlers()
  //python自定义ipc函数
  registerCustomPythonIpcHandlers()
  //puppeteer的pixiv
  registerPixivPuppeteerIpcHandlers()
  //puppeteer的bilibili
  registerBilibiliPuppeteerIpcHandlers()
  //chrome的ipc
  registerChromeIpcHandlers()
  //资源窗体的ipc
  registerResourcesIpcHandlers()
  //全局设置获取
  allSettingManager()
  //sharp图片处理
  sharpIpcHandlers()
  //ru34的ipc函数
  ru34IpcHandlers()
  //窗体ipc函数
  registerWindowIpcHandlers()
  //创建主窗体
  createWindow()
  //启动任务栏
  TrayManager(<BrowserWindow>readWindow('mainWindow'))
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', async () => {
  /*如果不是macos,就执行
  if (process.platform !== 'darwin') {
    await quitApply()
  }*/
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
