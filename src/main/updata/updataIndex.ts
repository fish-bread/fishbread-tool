import { dialog } from 'electron'
import { autoUpdater } from 'electron-updater'

//监听更新事件
export const appUpdate = (): void => {
  //配置自动更新行为
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = false
  //发现新版本可用
  autoUpdater.on('update-available', (info) => {
    console.log(`发现新版本: ${info.version}`)

    //提示用户是否下载
    const choice = dialog.showMessageBoxSync({
      type: 'info',
      buttons: ['下载', '取消'],
      title: '发现新版本',
      message: `检测到新版本 ${info.version}，是否立即下载？`
    })

    if (choice === 0) {
      //用户选择"下载"
      console.log('用户选择下载更新')
      autoUpdater.downloadUpdate()
    }
  })

  //当前已是最新版本
  autoUpdater.on('update-not-available', (info) => {
    console.log('当前已是最新版本', info.version)
  })

  //监听下载进度
  autoUpdater.on('download-progress', (progressObj) => {
    const percent = Math.round(progressObj.percent)
    console.log(`下载进度: ${percent}%`)
  })

  //更新下载完成
  autoUpdater.on('update-downloaded', () => {
    console.log('更新包下载完成，准备安装')

    const choice = dialog.showMessageBoxSync({
      type: 'info',
      buttons: ['立即安装', '稍后'],
      title: '更新准备就绪',
      message: '新版本已下载完成，是否立即退出应用并安装？'
    })

    if (choice === 0) {
      autoUpdater.quitAndInstall()
    }
  })

  //错误处理
  autoUpdater.on('error', (err) => {
    console.error('更新过程中发生错误:', err)
    dialog.showMessageBox({
      type: 'error',
      title: '更新错误',
      message: '更新检查失败，请检查网络连接或稍后重试。'
    })
  })
}
