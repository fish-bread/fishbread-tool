import { ipcMain } from 'electron'
import { ApiResponse, ru34Request, sendPost, TabsResponse } from '../../../types/ru34'
import ru34Class from './ru34Func'
import baseAxios from '../../general/BaseAxios'

export const ru34IpcHandlers = (): void => {
  //请求列表
  ipcMain.handle('ru34Search', async (_event, ru34Request: ru34Request): Promise<ApiResponse> => {
    //处理文本
    //const HandleTabs = HandleRu34Tabs(tabs)
    console.log('请求 Rule34 API', ru34Request.tabs)
    try {
      const ru34AxiosFunc = baseAxios.setProxyRequest(ru34Request.useProxy)
      const response = await ru34AxiosFunc({
        method: 'GET',
        url: `https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&tags=${ru34Request.tabs}&limit=100&json=1&api_key=34b7edd52505cfa2779259a6ffbeac84965f88efbbe815d2c0a5fd04aeeefaae5ca1136cde1fff185b2ce39a256677b420126e9b229bc5ba08fffe35d9c6db1e&user_id=5517327`
      })
      console.log('API 原始响应:', response.data)
      //直接返回数组
      return { posts: response.data }
    } catch (error) {
      console.error('Rule34 API 错误:', error)
      throw error // 重新抛出非 Axios 错误
    }
  })
  //请求
  ipcMain.handle(
    'ru34SearchTabs',
    async (_event, ru34Request: ru34Request): Promise<TabsResponse[]> => {
      const data = ru34Class.SearchRu34Tabs(ru34Request.tabs)
      console.log('数据', data)
      try {
        const ru34AxiosFunc = baseAxios.setProxyRequest(ru34Request.useProxy)
        const response = await ru34AxiosFunc({
          method: 'GET',
          url: `https://api.rule34.xxx/autocomplete.php?q=${data}`
        })
        console.log('API 原始响应:', response.data)
        //直接返回数组
        return response.data
      } catch (error) {
        console.error('Rule34 API 错误:', error)
        throw error // 重新抛出非 Axios 错误
      }
    }
  )
  //添加收藏到本地
  ipcMain.handle('addRu34Favorite', (_event, postData: sendPost): boolean => {
    return ru34Class.addFavoriteList(postData)
  })
  //初始化历史收藏
  ipcMain.handle('favoriteList', (): sendPost[] => {
    return ru34Class.searchLocalFavoriteList()
  })
  //删除特定记录
  ipcMain.handle('removeFavoriteList', (_event, id: number): sendPost[] => {
    return ru34Class.removeFavoriteList(id)
  })
}
