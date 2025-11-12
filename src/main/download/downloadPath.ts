import { join } from 'path'
import BasePath from '../general/BasePath'
import { app } from 'electron'
import Store from 'electron-store'
const store = new Store()
class DownloadPath extends BasePath {
  constructor(path: string) {
    super()
    this.setDownloadFilePath(path)
  }
  //还原
  restoreDownloadPathFunc = (): string => {
    store.delete('downloadPath')
    return this.setDownloadFilePath('download')
  }
  //设置文件下载位置
  private setDownloadFilePath = (pythonFile: string): string => {
    const localPath = this.getLocalPath('downloadPath')
    if (localPath) {
      this.currentPath = localPath
      return this.currentPath
    }
    if (app.isPackaged) {
      this.setLocalPath('downloadPath', join(app.getAppPath(), '..', `${pythonFile}`))
    } else {
      this.setLocalPath('downloadPath', join(__dirname, '..', '..', 'resources', `${pythonFile}`))
    }
    return this.currentPath
  }
}
export default new DownloadPath('download')
