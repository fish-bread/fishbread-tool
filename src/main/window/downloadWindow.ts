import { BrowserWindow } from 'electron'
import icon from '../../../resources/icon3.png?asset'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { readAllResourcesWindow, readWindow, saveWindow, windowIsCreate } from './windowManager'
//创建下载窗体
export const createDownloadWindow = (): void => {
  //检查窗体
  const bool = windowIsCreate('downloadWindow')
  if (bool) {
    return
  }
  const downloadWindow = new BrowserWindow({
    width: 450,
    height: 200,
    resizable: false,
    show: false,
    skipTaskbar: true,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    ...(process.platform === 'linux' ? { icon } : { icon }),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webgl: true
    }
  })
  console.log('downloadWindowid', downloadWindow.id)
  // 加载页面
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    downloadWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#/download`)
  } else {
    downloadWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: '#/download'
    })
  }
  // 窗口失去焦点时隐藏
  downloadWindow.on('blur', () => {
    if (downloadWindow && !downloadWindow.isDestroyed()) {
      downloadWindow.hide()
      const chromeWindow = readWindow('chromeWindow')
      const resourcesWindow = readAllResourcesWindow('resourcesWindow')
      if (chromeWindow) {
        chromeWindow?.webContents.send('downloadWindow-close', false)
      }
      if (resourcesWindow) {
        resourcesWindow.forEach((resource) => {
          resource?.webContents.send('downloadWindow-close', false)
        })
      }
    }
  })
  //添加的downLoad
  saveWindow(downloadWindow, 'downloadWindow')
}
