import { ipcRenderer } from 'electron'

export const windowApi = {
  maxSizeFunc: () => ipcRenderer.send('maxSizeFunc'), //最大化
  minimizeFunc: () => ipcRenderer.send('minimizeFunc'), //最小化
  closeWindowFunc: () => ipcRenderer.send('closeWindowFunc'), //关闭
  quitApplyFunc: () => ipcRenderer.send('quitApplyFunc'), //退出
}
