import { ElectronAPI } from '@electron-toolkit/preload'
import {
  puppeteerDataInter,
  pythonFilePath,
  allMessageInter,
  allProgressInter,
  viewInter,
  activeInter,
  themeColor,
  allSeparatorInter,
  puppeteerBilibiliDataInter
} from './mian'
import { sharpDialogInter, SharpInter } from './sharp'
import { ApiResponse, ru34Request, TabsResponse, sendPost } from './ru34'
import { downloadProgressInter } from './downLoad'
declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      //output
      pythonOutput: (callback: (message: allMessageInter) => void) => void
      puppeteerOutput: (callback: (message: allMessageInter) => void) => void
      puppeteerOutProgress: (callback: (message: allProgressInter) => void) => void
      puppeteerSeparatorOutput: (callback: (message: allSeparatorInter) => void) => void
      pythonSeparatorOutput: (callback: (message: allSeparatorInter) => void) => void
      //导航栏设置
      maxSizeFunc: () => void
      minimizeFunc: () => void
      closeWindowFunc: () => void
      quitApplyFunc: () => void
      //获取全局设置
      getPort: () => Promise<string>
      setPort: (port: string) => void
      getTheme: () => Promise<themeColor>
      setTheme: (theme: themeColor) => void
      sendTheme: (callback: (theme: themeColor) => void) => void
      //puppeteer全局
      getChromePath: () => Promise<string>
      restorePuppeteerPath: () => Promise<string>
      changePuppeteer: () => Promise<pythonFilePath>
      //添加自定义文件
      pathToFileURL: (filePath: string) => Promise<string>
      //添加资源页面显示
      showResources: (filePath: sendPost) => Promise<void>
      resourcesPath: (callback: (path: sendPost) => void) => void
      //获取pixiv
      getPixiv: (pid: string) => Promise<PixivIllustInfo>
    }
    chromeApi: {
      //浏览器设置
      openChromePage: (href: string) => void
      pageTitleUpdated: (callback: (message: viewInter[]) => void) => void
      pageMessage: (callback: (message: activeInter) => void) => void
      pageReloaded: (callback: (boolean: boolean) => void) => void
      //页面基础操作
      goBack: (tabId: number) => void
      goForward: (tabId: number) => void
      reload: (tabId: number) => void
      pageStop: (tabId: number) => void
      //默认浏览器打开
      pageBrowser: (tabId: number) => void
      //tab页设置
      getViewTab: () => Promise<activeInter>
      changePageTab: (tabId: number) => void
      closePageTab: (tabId: number) => void
    }
    pythonApi: {
      //airtestPython
      runPython: (time: number) => void
      killPython: () => void
      getPythonPath: () => Promise<string>
      //自定义python
      runCustomPython: () => void
      killCustomPython: () => void
      choosePython: () => Promise<pythonFilePath>
      restorePythonPath: () => Promise<string>
      getCustomPythonPath: () => Promise<string>
    }
    pixivApi: {
      //PixivPuppeteer爬虫
      runPuppeteer: (data: puppeteerDataInter) => Promise<void>
      killPuppeteer: () => Promise<void>
      getPixivFilePath: () => Promise<string>
      changePixivFilePath: () => Promise<pythonFilePath>
      restorePixivPath: () => Promise<string>
      getPixivCookie: () => Promise<string>
      changePixivCookie: (cookie: string) => Promise<string>
    }
    bilibiliApi: {
      //bilibiliPuppeteer爬虫
      runBilibiliPuppeteer: (data: puppeteerBilibiliDataInter) => void
      killBilibiliPuppeteer: () => void
      getBilibiliCookie: () => Promise<string>
      setBilibiliCookie: (cookie: string) => Promise<string>
      getBilibiliFilePath: () => Promise<string>
      setBilibiliFilePath: () => Promise<pythonFilePath>
      restoreBilibiliFilePath: () => Promise<string>
    }
    sharpApi: {
      sharpImage: (chooseType: string) => Promise<sharpDialogInter>
      sharpImageChange: (
        filePath: string[],
        chooseType: string,
        qualityLeave: number
      ) => Promise<SharpInter>
    }
    ru34Api: {
      ru34Search: (ru34Request: ru34Request) => Promise<ApiResponse>
      ru34SearchTabs: (ru34Request: ru34Request) => Promise<TabsResponse[]>
      addRu34Favorite: (postData: sendPost) => Promise<boolean>
      handleFavoriteList: (callback: (postData: sendPost[]) => void) => void
      favoriteList: () => Promise<sendPost[]>
      removeFavoriteList: (id: number) => Promise<sendPost[]>
    }
    downloadApi: {
      openDownload: (bool: boolean) => void
      downloadWindowClose: (callback: (bool: boolean) => void) => void
      downloadItem: (callback: (downloadProgress: downloadProgressInter) => void) => void
      getDownloadFilePath: () => Promise<string>
      setDownloadFilePath: () => Promise<pythonFilePath>
      restoreDownloadFilePath: () => Promise<string>
      setDownloadCookie: (cookie: string) => Promise<string> //废弃
      stopDownload: (uuid: string) => void
      playDownload: (uuid: string) => void
      cancelledDownload: (uuid: string) => void
      openResourcesDownloadUrl: (url: string) => void
    }
  }
}
