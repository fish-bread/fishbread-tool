import { ipcRenderer } from 'electron'
import { themeColor } from '../types/mian'
export const globalSettingApi = {
  getPort: () => ipcRenderer.invoke('getPort'),
  setPort: (port: string) => ipcRenderer.send('setPort', port),
  getTheme: () => ipcRenderer.invoke('getTheme'),
  setTheme: (theme: themeColor) => ipcRenderer.send('setTheme', theme),
  sendTheme: (callback: (theme: themeColor) => void): void => {
    ipcRenderer.on('page-theme', (_event, theme) => callback(theme))
  },
  getVersion: () => ipcRenderer.invoke('getVersion'),
}
