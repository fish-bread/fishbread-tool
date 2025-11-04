import Store from 'electron-store'
import { sendPost } from '../../../types/ru34'
import { getWindow } from '../../func/windowFunc'
const store = new Store()
class ru34Class {
  private ru34FavoriteList: sendPost[] = []
  //返回正确字符串
  SearchRu34Tabs = (tabs: string): string => {
    //查找最后一个空格的位置
    const lastSpaceIndex = tabs.lastIndexOf(' ')
    //如果找到了空格，则截取空格后的部分；否则返回原字符串
    if (lastSpaceIndex !== -1) {
      return tabs.substring(lastSpaceIndex + 1)
    }
    return tabs
  }
  //添加到本地
  addFavoriteList = (postData: sendPost): boolean => {
    console.log('执行')
    this.ru34FavoriteList = store.get('ru34FavoriteList', []) as sendPost[]
    // 检查是否已存在（避免重复添加）
    const exists = this.ru34FavoriteList.some((item) => item.id === postData.id)
    if (!exists) {
      this.ru34FavoriteList.push(postData)
      store.set('ru34FavoriteList', this.ru34FavoriteList)
      const targetWindow = getWindow(1)
      targetWindow?.webContents.send('handleFavoriteList', this.ru34FavoriteList)
      console.log('执行')
      return true
    }
    console.log('不执行')
    return false
  }
  //查询本地
  searchLocalFavoriteList = (): sendPost[] => {
    const list = store.get('ru34FavoriteList') as sendPost[]
    console.log('获取list', list)
    if (!list) {
      return []
    }
    return list
  }
  //删除特定列表并更新本地
  removeFavoriteList = (id: number): sendPost[] => {
    this.ru34FavoriteList = this.ru34FavoriteList.filter((item) => item.id !== id)
    store.set('ru34FavoriteList', this.ru34FavoriteList)
    return this.ru34FavoriteList
  }
}
//获取本地记录
export default new ru34Class()
