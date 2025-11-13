import { BrowserWindow } from 'electron'
import icon from '../../../resources/icon3.png?asset'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { saveWindow } from './windowManager'
//创建下载窗体
export const createUpdateWindow = (parentWindow: BrowserWindow): void => {
  const updateWindow = new BrowserWindow({
    width: 400,
    height: 300,
    resizable: false, // 禁止调整大小
    movable: false, // 禁止拖动
    minimizable: false, // 禁止最小化
    maximizable: false, // 禁止最大化
    modal: true, //模因窗口
    show: false,
    skipTaskbar: true,
    parent: parentWindow,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    ...(process.platform === 'linux' ? { icon } : { icon }),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webgl: true
    }
  })
  console.log('updateWindowid', updateWindow.id)
  // 加载页面
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    updateWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#/update`)
  } else {
    updateWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: '#/update'
    })
  }
  updateWindow.on('ready-to-show', () => {
    updateWindow.show()
  })
  //添加的downLoad
  saveWindow(updateWindow, 'updateWindow')
}
