import { ipcRenderer } from 'electron'
import { updateMessageInter } from '../types/update'
export const updateApi = {
  checkUpdate: () => ipcRenderer.send('checkUpdate'),
  downloadUpdate: () => ipcRenderer.send('downloadUpdate'),
  updateApp: () => ipcRenderer.send('updateApp'),
  updateMessage: (callback: (message: updateMessageInter) => void): void => {
    ipcRenderer.on('updateMessage', (_event, message) => callback(message))
  },
  updateProgress: (callback: (progress: number) => void): void => {
    ipcRenderer.on('updateProgress', (_event, value) => callback(value))
  },
  sendUpdateWindowUpdateMessage: (callback: (message: boolean) => void): void => {
    ipcRenderer.on('sendUpdateWindowUpdateMessage', (_event, message) => callback(message))
  }
}
