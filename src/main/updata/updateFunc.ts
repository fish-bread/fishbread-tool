import { updateMessageInter } from '../../types/update'
import { readWindow } from '../window/windowManager'
import { BrowserWindow } from 'electron'
import { createUpdateWindow } from '../window/updateWindow'
//发送消息给渲染进程
export const sendMainUpdateMessage = (message: updateMessageInter): void => {
  const mianWindow = readWindow('mainWindow')
  mianWindow?.webContents.send('updateMessage', {
    status: message.status,
    message: message.message
  })
}
//发送消息给下载窗体
export const sendUpdateWindowUpdateMessage = (message: boolean): void => {
  const mianWindow = readWindow('updateWindow')
  mianWindow?.webContents.send('sendUpdateWindowUpdateMessage', message)
}
//发送进度
export const sendMainUpdateProgress = (progress: number): void => {
  const mianWindow = readWindow('mainWindow')
  mianWindow?.webContents.send('updateProgress', progress)
}
//创建新下载窗体
export const createUpdateWindowFunc = (): void => {
  const mainWindow = readWindow('mainWindow')
  createUpdateWindow(mainWindow as BrowserWindow)
}
