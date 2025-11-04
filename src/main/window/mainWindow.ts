import { BrowserWindow, shell } from 'electron'
import icon from '../../../resources/icon3.png?asset'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { createNewChromeWindow } from '../chromeIpcMain/chrome/chromeFunc'
import { saveWindow } from './windowManager'
export const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 830,
    minWidth: 480,
    minHeight: 480,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden', //删除自定义
    ...(process.platform === 'linux' ? { icon } : { icon }), //图标
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })
  console.log('mainWindowid', mainWindow.id)
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    event.preventDefault()
    createNewChromeWindow(navigationUrl)
    console.log('拦截到导航跳转至: ', navigationUrl)
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  //保存实例
  saveWindow(mainWindow, 'mainWindow')
}
