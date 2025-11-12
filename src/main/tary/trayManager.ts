import { Tray, BrowserWindow } from 'electron'
import icon from '../../../resources/icon3.png?asset'
import { createTrayMenuWindow } from '../window/menuWindow'
import { readWindow } from '../window/windowManager'
import { toggleTrayMenu } from '../general/allMouse'
export let tray: Tray | null = null
export const TrayManager = (mainWindow: BrowserWindow): void => {
  tray = new Tray(icon)
  tray.setToolTip('fishbread-tool')

  //创建自定义菜单窗口
  createTrayMenuWindow()
  const menuWindow = readWindow('menuWindow')
  //修改右键点击事件，传递鼠标事件参数
  tray.on('right-click', () => {
    toggleTrayMenu(menuWindow as BrowserWindow) // 传递鼠标事件对象
  })
  //添加左键点击显示主窗口
  tray.on('click', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.show()
      mainWindow.focus()
    }
  })
}
