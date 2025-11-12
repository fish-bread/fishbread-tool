import { ipcRenderer } from 'electron'
import { downloadProgressInter } from '../types/downLoad'

export const downloadApi = {
  openDownload: (bool: boolean) => ipcRenderer.send('openDownload', bool),
  downloadWindowClose: (callback: (bool: boolean) => void): void => {
    ipcRenderer.on('downloadWindow-close', (_event, bool) => callback(bool))
  },
  downloadItem: (callback: (item: downloadProgressInter) => void): void => {
    ipcRenderer.on('send-download-item', (_event, item) => callback(item))
  },
  getDownloadFilePath: () => ipcRenderer.invoke('getDownloadFilePath'),
  setDownloadFilePath: () => ipcRenderer.invoke('setDownloadFilePath'),
  restoreDownloadFilePath: () => ipcRenderer.invoke('restoreDownloadFilePath'),
  stopDownload: (uuid: string) => ipcRenderer.send('stopDownload', uuid),
  playDownload: (uuid: string) => ipcRenderer.send('playDownload', uuid),
  cancelledDownload: (uuid: string) => ipcRenderer.send('cancelledDownload', uuid),
  openResourcesDownloadUrl: (url: string) => ipcRenderer.send('openResourcesDownloadUrl', url),
}
