import { activeInter, Tab, viewInter } from '../../../types/mian'
import { BrowserWindow } from 'electron'
import BaseChromeTab from './BaseChromeTab'
import { createChildWindow, createChromeWindow } from '../../window/chromeWindow'
import { readWindow } from '../../window/windowManager'
//关闭chrome窗体并自增id并将tab为空
export const closeChromeWindow = (): void => {
  const window = readWindow('chromeWindow')
  window?.destroy()
  BaseChromeTab.tabs = []
}
//获取是否可以返回或前进并返回数组给渲染进程
export const isGoBack = (tabId: number): void => {
  const targetTab: Tab | undefined = BaseChromeTab.tabs.find((tab: Tab) => tab.id === tabId)

  if (targetTab && targetTab.view) {
    //获取导航历史状态
    const canGoBack = targetTab.view.webContents.navigationHistory.canGoBack()
    const canGoForward = targetTab.view.webContents.navigationHistory.canGoForward()
    //更新标签页对象的导航状态
    ;(targetTab as Tab).isGoBack = canGoBack
    ;(targetTab as Tab).isGoForward = canGoForward
  }
}
//创建没有view实例的新数组返回给渲染进程
export const sendMessageFunc = (): viewInter[] => {
  return BaseChromeTab.tabs.map((tab: Tab) => {
    return {
      id: tab.id,
      title: tab.title,
      isGoBack: tab.isGoBack,
      isGoForward: tab.isGoForward
    }
  })
}
//发送窗体消息
export const sendChromeWindow = (message: activeInter): void => {
  const targetWindow = readWindow('chromeWindow')
  if (targetWindow) {
    targetWindow.webContents.send('page-message', message)
  }
}
//发送标题更新
export const sendPage = (): void => {
  const sendMessage = sendMessageFunc()
  //向渲染进程发送消息
  const targetWindow = readWindow('chromeWindow')
  if (targetWindow) {
    console.log('消息', sendMessage)
    targetWindow.webContents.send('page-title-updated', sendMessage)
  }
}
//返回简略数组和最大id
export const sendMaxMessage = (): activeInter => {
  const allIds = BaseChromeTab.tabs.map((tab: Tab) => tab.id)
  const maxId = Math.max(...allIds, -Infinity) || 0
  return {
    viewMessage: sendMessageFunc(),
    activeId: maxId
  }
}
//遍历隐藏其余页面并显示活动页面
export const hidePageWindow = (tabId: number): void => {
  const bounds = (BaseChromeTab.chromeWindow as BrowserWindow).getBounds() // 获取窗口当前边界
  //遍历所有标签页，隐藏非活动视图
  BaseChromeTab.tabs.forEach((tab) => {
    if (tab.id === tabId) {
      //显示选中的WebContentsView，并设置其边界
      tab.view.setBounds({
        x: 0,
        y: 40,
        width: bounds.width,
        height: bounds.height - 40
      })
    } else {
      // 通过将视图移出可视区域或设置为零尺寸来实现隐藏
      tab.view.setBounds({
        x: 0,
        y: 0,
        width: 0,
        height: 0
      })
    }
  })
}
//创建新的chrome页面和子页面
export const createNewChromeWindow = (href: string): void => {
  createChromeWindow()
  const chromeWindow = readWindow('chromeWindow')
  BaseChromeTab.chromeWindow = chromeWindow
  createChildWindow(chromeWindow as BrowserWindow, href, BaseChromeTab.getNextId())
  sendChromeWindow(sendMaxMessage())
}
