import { ipcMain, app } from 'electron'
import { autoUpdater } from 'electron-updater'
import {
  createUpdateWindowFunc,
  sendMainUpdateMessage,
  sendMainUpdateProgress,
  sendUpdateWindowUpdateMessage
} from './updateFunc'

//监听更新事件
export const appUpdate = (): void => {
  //配置自动更新行为
  autoUpdater.forceDevUpdateConfig = true //用于测试,在dev中允许检查更新
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = false
  //发现新版本可用
  autoUpdater.on('update-available', async (info) => {
    console.log(`发现新版本: ${info.version}`)
    sendMainUpdateMessage({
      status: 'update',
      message: `发现新版本: ${info.version}`
    })
    createUpdateWindowFunc()
  })

  //当前已是最新版本
  autoUpdater.on('update-not-available', (info) => {
    console.log('当前已是最新版本', info.version)
    sendMainUpdateMessage({
      status: 'success',
      message: `当前已是最新版本, ${info.version}`
    })
  })

  //监听下载进度
  autoUpdater.on('download-progress', (progressObj) => {
    const percent = Math.round(progressObj.percent)
    console.log(`下载进度: ${percent}%`)
    sendMainUpdateProgress(percent)
  })

  //更新下载完成
  autoUpdater.on('update-downloaded', () => {
    console.log('更新包下载完成，准备安装')
    sendUpdateWindowUpdateMessage(true)
  })

  //错误处理
  autoUpdater.on('error', async (err) => {
    console.error('更新过程中发生错误:', err)
    sendMainUpdateMessage({
      status: 'error',
      message: `更新检查失败，请检查网络连接或稍后重试。`
    })
  })
}
//监听更新ipc
export const registerUpdateIpcHandlers = (): void => {
  //检查更新
  ipcMain.on('checkUpdate', async () => {
    await autoUpdater.checkForUpdates()
  })
  //确认下载
  ipcMain.on('downloadUpdate', async () => {
    await autoUpdater.downloadUpdate()
  })
  //下载新版本
  ipcMain.on('updateApp', async () => {
    autoUpdater.quitAndInstall()
  })
  //获取版本
  ipcMain.handle('getVersion', async () => {
    return app.getVersion()
  })
}
