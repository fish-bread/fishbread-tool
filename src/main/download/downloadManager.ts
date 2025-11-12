import { BrowserWindow, ipcMain } from 'electron'
import { readWindow } from '../window/windowManager'
import { toggleRightWindow } from '../general/allMouse'
import { pythonFilePath } from '../../types/mian'
import { savePathDialog } from '../dialog/fileSaveDialog'
import DownloadPath from '../download/downloadPath'
import downloadClass from '../download/downloadFunc'
export const registerDownloadIpcHandlers = (): void => {
  //打开下载界面
  ipcMain.on('openDownload', (_event, bool: boolean): void => {
    const downLoadWindow = readWindow('downloadWindow')
    console.log('Download download window', bool)
    if (bool) {
      toggleRightWindow(downLoadWindow as BrowserWindow)
    } else {
      downLoadWindow?.hide()
    }
  })
  //根据传递的url开启下载任务
  ipcMain.on('openResourcesDownloadUrl', (event, url: string): void => {
    const senderWebContents = event.sender
    // 2. 通过 webContents 找到对应的 BrowserWindow 对象
    const senderWindow = BrowserWindow.fromWebContents(senderWebContents)
    senderWindow?.webContents.downloadURL(url)
  })
  //暂停
  ipcMain.on('stopDownload', (_event, uuid: string): void => {
    downloadClass.stopDownload(uuid)
  })
  //继续
  ipcMain.on('playDownload', (_event, uuid: string): void => {
    downloadClass.playDownload(uuid)
  })
  //取消
  ipcMain.on('cancelledDownload', (_event, uuid: string): void => {
    downloadClass.cancelledDownload(uuid)
  })
  //获取文件path
  ipcMain.handle('getDownloadFilePath', async (): Promise<string> => {
    return DownloadPath.getPath()
  })
  //修改文件path
  ipcMain.handle('setDownloadFilePath', async (): Promise<pythonFilePath> => {
    try {
      const pathFile = await savePathDialog()
      if (pathFile.filePaths[0]) {
        DownloadPath.setLocalPath('downloadPath', pathFile.filePaths[0])
      }
      return {
        canceled: pathFile.canceled,
        filePath: pathFile.filePaths[0]
      }
    } catch (e) {
      console.error(e)
      throw e
    }
  })
  //还原文件path
  ipcMain.handle('restoreDownloadFilePath', async (): Promise<string> => {
    return DownloadPath.restoreDownloadPathFunc()
  })
}
