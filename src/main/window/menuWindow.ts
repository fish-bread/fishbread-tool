import { BrowserWindow } from 'electron'
import { is } from '@electron-toolkit/utils'
import icon from '../../../resources/icon3.png?asset'
import { join } from 'path'
import { saveWindow } from './windowManager'
export const createTrayMenuWindow = (): void => {
  //创建无边框、始终置顶的透明窗口
  const menuWindow = new BrowserWindow({
    width: 150,
    height: 67,
    frame: false,
    resizable: false,
    show: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    transparent: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden', //删除自定义
    ...(process.platform === 'linux' ? { icon } : { icon }), //图标
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    menuWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#/menu`)
  } else {
    menuWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: '#/menu'
    })
  }
  // 窗口失去焦点时隐藏
  menuWindow.on('blur', () => {
    if (menuWindow && !menuWindow.isDestroyed()) {
      menuWindow.hide()
    }
  })
  console.log('menuWindowid', menuWindow.id)
  //保存实例
  saveWindow(menuWindow, 'menuWindow')
}
