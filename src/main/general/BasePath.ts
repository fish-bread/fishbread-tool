import Store from 'electron-store'
const store = new Store()
type keyInter =
  | 'pythonPath'
  | 'customPythonPath'
  | 'chromePath'
  | 'pixivPath'
  | 'bilibiliPath'
  | 'downloadPath'
class BasePathManager {
  protected currentPath: string = ''
  // 返回当前路径
  getPath(): string {
    console.log('当前获取路径', this.currentPath)
    return this.currentPath
  }
  //本地存储文件path
  setLocalPath = (key: keyInter, path: string): void => {
    store.set(key, path)
    this.currentPath = path
  }
  //本地获取文件path
  getLocalPath = (key: keyInter): string | null => {
    const path = store.get(key)
    if (path) {
      return String(path)
    }
    return null
  }
  //一个更通用的路径重置方法
  restorePath(defaultPath: string): string {
    this.currentPath = defaultPath
    return this.currentPath
  }
}
export default BasePathManager
