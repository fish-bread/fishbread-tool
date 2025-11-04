import { ipcMain, shell } from 'electron'
import {
  sendMessageFunc,
  sendChromeWindow,
  sendMaxMessage,
  hidePageWindow,
  isGoBack,
  closeChromeWindow,
  createNewChromeWindow
} from './chrome/chromeFunc'
import BaseChromeTab from './chrome/BaseChromeTab'
import { activeInter, Tab } from '../../types/mian'
import baseChromeTab from './chrome/BaseChromeTab'
import { closeWindow, readWindow } from '../window/windowManager'
export const registerChromeIpcHandlers = (): void => {
  //创建页面
  ipcMain.on('openChromePage', (_event, href: string): void => {
    console.log('创建新chrome页面')
    createNewChromeWindow(href)
  })
  //获取页面
  ipcMain.handle('getViewTab', (): activeInter => {
    console.log('getViewTab')
    return sendMaxMessage()
  })
  //更换标签页
  ipcMain.on('change-page-tab', (_event, tabId: number): void => {
    hidePageWindow(tabId)
  })
  //关闭标签页
  ipcMain.on('close-tab', (_event, tabId: number): void => {
    const tabToClose = baseChromeTab.tabs.find((tab: Tab) => tab.id === tabId)
    if (tabToClose) {
      // 销毁 WebContentsView
      if (!tabToClose.view.webContents.isDestroyed()) {
        tabToClose.view.webContents.close()
      }
      // 从数组中移除标签
      baseChromeTab.tabs = baseChromeTab.tabs.filter((tab: Tab) => tab.id !== tabId)
      console.log('当前数组', baseChromeTab.tabs)
      // 确定要激活的标签页ID
      let activeTabId: number | null = null
      if (baseChromeTab.tabs.length > 0) {
        // 查找当前关闭标签页的索引
        const closedTabIndex = baseChromeTab.tabs.findIndex((tab) => tab.id === tabId)
        if (closedTabIndex === -1 || closedTabIndex === 0) {
          // 如果关闭的是第一个标签页或找不到索引，则激活新的第一个标签页
          activeTabId = baseChromeTab.tabs[0].id
        } else {
          // 否则激活上一个标签页
          activeTabId = baseChromeTab.tabs[closedTabIndex - 1].id
        }
        // 激活选中的标签页
        if (activeTabId !== null) {
          hidePageWindow(activeTabId)
        }
        const message: activeInter = {
          viewMessage: sendMessageFunc(),
          activeId: activeTabId as number
        }
        sendChromeWindow(message)
      } else {
        const message: activeInter = {
          viewMessage: sendMessageFunc(),
          activeId: 0
        }
        sendChromeWindow(message)
        closeChromeWindow()
        closeWindow('chromeWindow')
      }
    }
  })
  //用默认浏览器打开
  ipcMain.on('open-in-browser', (_event, tabId: number): void => {
    const tabPage: Tab | undefined = baseChromeTab.tabs.find((tab: Tab) => tab.id === tabId)
    const currentUrl = (tabPage as Tab).view.webContents.getURL()
    if (currentUrl) {
      shell.openExternal(currentUrl)
    }
  })
  //返回上一个
  ipcMain.on('nav-go-back', (_event, tabId: number): void => {
    const tabIndex = BaseChromeTab.tabs.findIndex((tab) => tab.id === tabId)
    if (tabIndex !== -1) {
      BaseChromeTab.tabs[tabIndex].view.webContents.navigationHistory.goBack()
    }
    isGoBack(tabId)
    const message: activeInter = {
      viewMessage: sendMessageFunc(),
      activeId: tabId
    }
    sendChromeWindow(message)
  })
  //返回下一个
  ipcMain.on('nav-go-forward', (_event, tabId: number): void => {
    const tabIndex = BaseChromeTab.tabs.findIndex((tab) => tab.id === tabId)
    if (tabIndex !== -1) {
      BaseChromeTab.tabs[tabIndex].view.webContents.navigationHistory.goForward()
    }
    isGoBack(tabId)
    const message: activeInter = {
      viewMessage: sendMessageFunc(),
      activeId: tabId
    }
    sendChromeWindow(message)
  })
  //刷新页面
  ipcMain.on('nav-reload', (_event, tabId: number) => {
    console.log('刷新页面')
    const tabIndex = BaseChromeTab.tabs.findIndex((tab) => tab.id === tabId)
    if (tabIndex !== -1) {
      BaseChromeTab.tabs[tabIndex].view.webContents.reload()
    }
    const targetWindow = readWindow('chromeWindow')
    if (targetWindow) {
      targetWindow.webContents.send('page-reloaded', false)
    }
  })
  //取消加载页面
  ipcMain.on('nav-stop', (_event, tabId: number) => {
    console.log('取消刷新')
    const tabIndex = BaseChromeTab.tabs.findIndex((tab) => tab.id === tabId)
    if (tabIndex !== -1) {
      BaseChromeTab.tabs[tabIndex].view.webContents.stop()
    }
    const targetWindow = readWindow('chromeWindow')
    if (targetWindow) {
      targetWindow.webContents.send('page-reloaded', true)
    }
  })
}
