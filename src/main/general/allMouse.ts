//菜单显示在鼠标点击位置的右上角
import { BrowserWindow, screen } from 'electron'
import { tray } from '../tary/trayManager'
export const toggleTrayMenu = (menuWindow: BrowserWindow): void => {
  if (!menuWindow || !tray) return

  if (menuWindow.isVisible()) {
    menuWindow.hide()
  } else {
    const [menuWidth, menuHeight] = menuWindow.getSize()
    const cursorPosition = screen.getCursorScreenPoint()
    let clickPoint = cursorPosition ? { x: cursorPosition.x, y: cursorPosition.y } : { x: 0, y: 0 }

    if (cursorPosition && cursorPosition.x !== undefined && cursorPosition.y !== undefined) {
      //使用鼠标事件中的精确位置
      clickPoint = { x: cursorPosition.x, y: cursorPosition.y }
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
//鼠标右上角对齐
export const toggleRightWindow = (menuWindow: BrowserWindow): void => {
  if (!menuWindow || !tray) return

  if (menuWindow.isVisible()) {
    menuWindow.hide()
  } else {
    const [menuWidth, menuHeight] = menuWindow.getSize()
    const cursorPosition = screen.getCursorScreenPoint()
    let clickPoint = cursorPosition ? { x: cursorPosition.x, y: cursorPosition.y } : { x: 0, y: 0 }

    if (cursorPosition && cursorPosition.x !== undefined && cursorPosition.y !== undefined) {
      //使用鼠标事件中的精确位置
      clickPoint = { x: cursorPosition.x, y: cursorPosition.y }
    }

    //获取当前屏幕信息
    const currentScreen = screen.getDisplayNearestPoint(clickPoint)
    const workArea = currentScreen.workArea

    // 菜单右上角对齐鼠标点击位置
    let x = Math.round(clickPoint.x - menuWidth) // 菜单右边缘对齐鼠标X坐标
    let y = Math.round(clickPoint.y) // 菜单顶部对齐鼠标Y坐标

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
