import { BrowserWindow, shell, WebContentsView } from 'electron'
import icon from '../../../resources/icon3.png?asset'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import BaseChromeTab from '../chromeIpcMain/chrome/BaseChromeTab'
import {
  isGoBack,
  sendChromeWindow,
  sendMessageFunc,
  sendPage,
  createNewChromeWindow
} from '../chromeIpcMain/chrome/chromeFunc'
import { activeInter } from '../../types/mian'
import { readWindow, saveWindow, windowIsCreate } from './windowManager'
import downloadClass from '../download/downloadFunc'
//创建新窗体
export const createChromeWindow = (): void => {
  //检查窗体
  const bool = windowIsCreate('chromeWindow')
  if (bool) {
    return
  }
  const chromeWindow = new BrowserWindow({
    width: 1280,
    height: 830,
    minWidth: 480,
    minHeight: 480,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    ...(process.platform === 'linux' ? { icon } : { icon }),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webgl: true
    }
  })

  console.log('chromeWindowid', chromeWindow.id)
  // 加载页面
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    chromeWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}#/chrome`)
  } else {
    chromeWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: '#/chrome'
    })
  }
  chromeWindow.on('ready-to-show', () => {
    chromeWindow.show()
  })
  //监听chrome页面的下载连接并返回数据
  downloadClass.watchDownload(chromeWindow)
  //保存窗体
  saveWindow(chromeWindow, 'chromeWindow')
}
//创建子窗体
export const createChildWindow = (
  chromeWindow: BrowserWindow,
  href: string,
  tabId: number
): WebContentsView => {
  // 添加 WebContentsView
  const view = new WebContentsView()
  chromeWindow.contentView.addChildView(view)
  // 更新视图边界函数
  const updateViewBounds = (): void => {
    const bounds = chromeWindow.getBounds()
    view.setBounds({
      x: 0,
      y: 40,
      width: bounds.width,
      height: bounds.height - 40
    })
  }
  // 设置事件监听器,用于控制子窗体的大小随主窗体的变化而变化
  const setupEventListeners = (): void => {
    chromeWindow.on('ready-to-show', () => {
      chromeWindow.show()
    })
    chromeWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })
    // 分别为每个事件添加监听器，避免类型错误
    chromeWindow.on('resize', updateViewBounds)
    chromeWindow.on('move', updateViewBounds)
    chromeWindow.on('maximize', updateViewBounds)
    chromeWindow.on('unmaximize', updateViewBounds)
    chromeWindow.on('enter-full-screen', updateViewBounds)
    chromeWindow.on('leave-full-screen', updateViewBounds)
  }
  //监听标题变化
  view.webContents.on('page-title-updated', (_event, title) => {
    console.log('页面标题更新为:', title)
    // 更新标签页数组中的标题
    const tabIndex = BaseChromeTab.tabs.findIndex((tab) => tab.id === tabId)
    if (tabIndex !== -1) {
      BaseChromeTab.tabs[tabIndex].title = title
      BaseChromeTab.tabs[tabIndex].url = view.webContents.getURL()
      console.log('标签页标题已更新', BaseChromeTab.tabs[tabIndex])
    }
    //发送消息给渲染进程
    sendPage()
  })
  //监听页面加载完毕
  view.webContents.on('did-finish-load', () => {
    console.log('页面已经完全加载完毕')
    const targetWindow = readWindow('chromeWindow')
    if (targetWindow) {
      targetWindow.webContents.send('page-reloaded', true)
    }
  })
  //监听 WebContentsView 中的导航事件
  view.webContents.on('did-navigate-in-page', (_event, navigationUrl) => {
    console.log('监听导航', navigationUrl)
    isGoBack(tabId)
    const message: activeInter = {
      viewMessage: sendMessageFunc(),
      activeId: tabId
    }
    sendChromeWindow(message)
  })
  //监听子页面中的打开新页面
  view.webContents.setWindowOpenHandler((details) => {
    const href = details.url
    console.log('创建新页面')
    createNewChromeWindow(href)
    return { action: 'deny' } //阻止默认的窗口创建行为
  })
  // 初始化
  updateViewBounds()
  view.webContents.loadURL(href)
  setupEventListeners()

  //添加进数组
  BaseChromeTab.tabs.push({
    id: tabId,
    view: view,
    title: view.webContents.getTitle(),
    url: view.webContents.getURL(),
    isGoBack: view.webContents.navigationHistory.canGoBack(),
    isGoForward: view.webContents.navigationHistory.canGoForward()
  })
  //返回
  return view
}
