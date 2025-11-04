//获取窗体
import { BrowserWindow, app } from 'electron'
import BilibiliCore from '../puppeteerIpcMain/puppeteer/bilibili/bilibiliCore'
import PuppeteerCore from '../puppeteerIpcMain/puppeteer/pixiv/pixivCore'
import { PyShell } from '../pythonIpcMian/pythonProcessManager'
export const getWindow = (winId: number): Electron.BrowserWindow | undefined => {
  const allWindows = BrowserWindow.getAllWindows()
  return allWindows.find((win) => win.id === winId)
}
//获取全部窗体
export const getAllWindow = (): Electron.BrowserWindow[] => {
  return BrowserWindow.getAllWindows()
}
//安全退出应用
export const quitApply = async (): Promise<void> => {
  PyShell?.kill()
  await BilibiliCore.killPuppeteer()
  await PuppeteerCore.killPuppeteer()
  app.quit()
}
