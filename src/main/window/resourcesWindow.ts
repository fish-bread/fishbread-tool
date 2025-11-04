import { BrowserWindow, shell } from 'electron'
import icon from '../../../resources/icon3.png?asset'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import { createNewChromeWindow } from '../chromeIpcMain/chrome/chromeFunc'
import { sendPost } from '../../types/ru34'
import { readResourcesWindow, saveWindow } from './windowManager'
export const createResourcesWindow = (filePath: sendPost): void => {
  const resourcesWindow = new BrowserWindow({
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
  console.log('resourcesWindowid', resourcesWindow.id)
  //保存窗体
  saveWindow(resourcesWindow, 'resourcesWindow')
  resourcesWindow.on('ready-to-show', () => {
    resourcesWindow.show()
    const targetWindow = readResourcesWindow(resourcesWindow.id, 'resourcesWindow')
    console.log('路径', filePath)
    if (targetWindow) {
      targetWindow.webContents.send('resources-path', filePath)
    }
  })

  resourcesWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    event.preventDefault()
    createNewChromeWindow(navigationUrl)
    console.log('拦截到导航跳转至: ', navigationUrl)
  })

  resourcesWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    resourcesWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#/resources`)
  } else {
    resourcesWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: '#/resources'
    })
  }
}
