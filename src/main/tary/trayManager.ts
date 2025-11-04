import { Tray, BrowserWindow, screen } from 'electron'
import icon from '../../../resources/icon3.png?asset'
import { createTrayMenuWindow } from '../window/menuWindow'
import { readWindow } from '../window/windowManager'

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

//修正后的定位逻辑：菜单显示在鼠标点击位置的右上角
const toggleTrayMenu = (menuWindow: BrowserWindow): void => {
  if (!menuWindow || !tray) return

  if (menuWindow.isVisible()) {
    menuWindow.hide()
  } else {
    const [menuWidth, menuHeight] = menuWindow.getSize()
    const cursorPosition = screen.getCursorScreenPoint()
    //获取鼠标点击位置
    let clickPoint: { x: number; y: number }

    if (cursorPosition && cursorPosition.x !== undefined && cursorPosition.y !== undefined) {
      //使用鼠标事件中的精确位置
      clickPoint = { x: cursorPosition.x, y: cursorPosition.y }
    } else {
      //备用方案：使用托盘图标中心位置
      const trayBounds = tray.getBounds()
      clickPoint = {
        x: trayBounds.x + trayBounds.width / 2,
        y: trayBounds.y + trayBounds.height / 2
      }
    }

    //获取当前屏幕信息
    const currentScreen = screen.getDisplayNearestPoint(clickPoint)
    const workArea = currentScreen.workArea

    //菜单左下角对齐鼠标点击位置的右上角
    let x = Math.round(clickPoint.x) // 菜单左边缘对齐鼠标X坐标
    let y = Math.round(clickPoint.y - menuHeight) // 菜单底部对齐鼠标Y坐标

    //边界检测和调整
    if (x + menuWidth > workArea.x + workArea.width) {
      //如果右侧空间不够，显示在鼠标左侧
      x = Math.round(clickPoint.x - menuWidth)
    }
    if (y < workArea.y) {
      //如果上方空间不够，显示在鼠标下方
      y = Math.round(clickPoint.y)
    }
    if (x < workArea.x) {
      x = workArea.x
    }
    if (y + menuHeight > workArea.y + workArea.height) {
      y = workArea.y + workArea.height - menuHeight
    }

    menuWindow.setPosition(x, y)
    menuWindow.show()
    menuWindow.focus()
  }
}
