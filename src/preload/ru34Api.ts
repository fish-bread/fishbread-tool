import { ipcRenderer } from 'electron'
import { ru34Request, sendPost } from '../types/ru34'
export const ru34Api = {
  ru34Search: (ru34Request: ru34Request) => ipcRenderer.invoke('ru34Search', ru34Request),
  ru34SearchTabs: (ru34Request: ru34Request) => ipcRenderer.invoke('ru34SearchTabs', ru34Request),
  addRu34Favorite: (postData: sendPost) => ipcRenderer.invoke('addRu34Favorite', postData),
  handleFavoriteList: (callback: (message: sendPost[]) => void): void => {
    ipcRenderer.on('handleFavoriteList', (_event, message) => callback(message))
  },
  favoriteList: () => ipcRenderer.invoke('favoriteList'),
  removeFavoriteList: (id: number) => ipcRenderer.invoke('removeFavoriteList', id),
}
