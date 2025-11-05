import { puppeteerPrintFunc, puppeteerSeparatorPrintFunc } from '../../../general/allPrint'
import {
  pixivBodyInter,
  pixivHrefInter,
  puppeteerDataInter,
  searchPixivInter,
  cookieInter,
  netSpeedInter
} from '../../../../types/mian'
import PixivCookie from './pixivCookie'
import pixivPath from './pixivPath'
import baseAxios from '../../../general/BaseAxios'
import fs from 'fs'
import { join } from 'path'
import { puppeteerProgressFunc } from '../../../general/allProgerss'
import { v4 as uuidv4 } from 'uuid'
import pLimit from 'p-limit'
import BasePuppeteer from '../../../general/BasePuppeteer'
import dayjs from 'dayjs'
class PuppeteerCore extends BasePuppeteer {
  //启动
  runPuppeteer = async (data: puppeteerDataInter): Promise<void> => {
    try {
      puppeteerSeparatorPrintFunc('pixiv脚本')
      //设置代理端口
      this.setPort(data.port)
      //获取浏览器路径
      const chromePath = this.getChromePath()
      //检测
      const isRunPuppeteer = this.lockedPuppeteer(chromePath)
      if (!isRunPuppeteer) {
        return
      }
      //网址和cookie
      const cookieData: cookieInter = {
        cookie: PixivCookie.getCookies(),
        href: '.pixiv.net'
      }
      //启动浏览器
      await this.startPuppeteer(data, chromePath, cookieData)
      //解析pid网址
      const PageUrl = await this.analyzeHrefFunc(data.href)
      if (!PageUrl) {
        puppeteerPrintFunc('error', `puppeteer报错,链接无效或找不到图片`)
        await this.exitPuppeteer()
        return
      }
      puppeteerPrintFunc(
        'info',
        `原pixiv图片链接为${PageUrl.imgHref}, 图片api链接为${PageUrl.ajaxHref},正在查询对应数据,请稍后`
      )
      //查询图片函数
      const searchData = await this.searchPixivFunc(PageUrl)
      if (!searchData) {
        puppeteerPrintFunc('error', '未查询到图片,请确认链接是否正确或网络是否畅通')
        await this.exitPuppeteer()
        return
      }
      //查询pid名字函数
      const PidName = await this.searchNamePixivFunc(PageUrl)
      if (!PidName) {
        await this.exitPuppeteer()
      } else {
        //下载图片
        const allTime = await this.downloadPixivAxios(searchData, PidName, data.useProxy)
        puppeteerPrintFunc('info', `puppeteer执行完成,共耗时${allTime}秒`)
      }
      //关闭浏览器实例
      await this.exitPuppeteer()
    } catch (e) {
      puppeteerPrintFunc('error', `puppeteer报错,${e}`)
      await this.exitPuppeteer()
    }
  }
  //查询图片函数
  searchPixivFunc = async (PageUrl: pixivHrefInter): Promise<searchPixivInter | null> => {
    let pageText: pixivBodyInter
    let urlsArray: string[] = []
    //网络监听
    this.page?.on('response', async (response) => {
      if (response.url() === PageUrl.ajaxHref) {
        pageText = await response.json()
        urlsArray = pageText.body.map((allUrl) => {
          return allUrl.urls.original
        })
        puppeteerPrintFunc(
          'info',
          `成功获取到${urlsArray.length}张图片,所有原始图片链接数组, ${urlsArray}`
        )
      }
    })
    //打开页面
    await this.page?.goto(PageUrl.ajaxHref, { waitUntil: 'domcontentloaded' })
    await this.page?.waitForSelector('body', { timeout: 15000 })
    puppeteerPrintFunc('info', '成功查询到当前pid图片网址,请稍后')
    //前往图片原页面
    await this.page?.goto(PageUrl.imgHref, { waitUntil: 'domcontentloaded' })
    await this.page?.waitForSelector('body', { timeout: 15000 })
    return {
      urlsArray: urlsArray,
      PageUrl: PageUrl
    }
  }
  //查询pid图片名称函数
  searchNamePixivFunc = async (href: pixivHrefInter): Promise<string | null> => {
    await this.page?.goto(href.imgHref, { waitUntil: 'domcontentloaded' })
    await this.page?.waitForSelector('body', { timeout: 15000 })
    await this.page?.waitForSelector('h1', { timeout: 15000 })
    if (this.page) {
      const fileName = await this.page?.$eval('h1', (h1) => {
        return h1.innerHTML
      })
      return this.sanitizeFilename(fileName)
    } else {
      puppeteerPrintFunc('error', `无法获取图片名称`)
      return null
    }
  }
  //分析用户输入的网址或pid
  analyzeHrefFunc = async (href: string): Promise<pixivHrefInter | null> => {
    const pixivArtworkIdPattern =
      /(?:(?:https?:\/\/)?(?:www\.)?pixiv\.net\/artworks\/)?(\d+)(?:\?[^#\s]*)?/i

    // 尝试从输入字符串中匹配pid
    const match = href.match(pixivArtworkIdPattern)

    if (match && match[1]) {
      // 如果匹配成功，提取PID并构建标准URL
      const pid = match[1]
      const imgHref = `https://www.pixiv.net/artworks/${pid}`
      const ajaxHref = `https://www.pixiv.net/ajax/illust/${pid}/pages?lang=zh`
      return {
        ajaxHref: ajaxHref,
        imgHref: imgHref
      }
    } else {
      // 如果输入无法识别，可以根据需要返回默认值或抛出异常
      console.error('无法从输入中提取有效链接:', href)
      return null
    }
  }
  //下载图片函数
  downloadPixivAxios = async (
    searchData: searchPixivInter,
    PidName: string,
    useProxy: boolean
  ): Promise<number> => {
    const downloadDir = pixivPath.getPath()
    let allTime: number = 0
    puppeteerPrintFunc('info', `图片将保存至目录: ${downloadDir},开始遍历下载图片`)
    //创建并发限制器,设置最大并发数5
    const limit = pLimit(5)
    const downloadPromises: Promise<void>[] = []
    //检查图片是否路径文件夹是否存在
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true })
    }
    //设置是否启用代理请求
    const pixivAxiosFunc = baseAxios.setProxyRequest(useProxy)
    for (let i = 0; i < searchData.urlsArray.length; i++) {
      const promise = limit(async () => {
        try {
          //获取时间
          const dataTime: number = Date.now()
          //将url作为文件名
          const imageUrl = searchData.urlsArray[i]
          const urlObj = new URL(imageUrl)
          const imageName = urlObj.pathname.split('/').pop() || `image_${i}.jpg`
          const fileName = `${PidName}_${imageName}`
          const filePath = join(downloadDir, fileName)
          // 用于网速计算的变量
          const netSpeed: netSpeedInter = {
            lastUpdateTime: Date.now(), // 初始化为当前时间
            lastDownloadedSize: 0, // 初始下载量为0
            lastFormattedSpeed: '0.00 KB/s', // 初始显示值
            lastReportTime: 0
          }
          //请求图片
          const response = await pixivAxiosFunc({
            signal: this.cancelToken.signal,
            headers: {
              Referer: searchData.PageUrl.imgHref,
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
              Cookie: PixivCookie.getCookies()
            },
            url: searchData.urlsArray[i],
            responseType: 'stream'
          })
          //获取文件总长度
          let downloadedSize = 0
          const contentLength = parseInt(response.headers['content-length'])
          // 创建写入流
          const writer = fs.createWriteStream(filePath)
          //写入数据
          response.data.pipe(writer)
          //生成唯一uuid
          const taskId = uuidv4()
          //更新进度
          const downTime = dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')
          response.data.on('data', (chunk: Buffer) => {
            downloadedSize += chunk.length
            //计算进度
            const progress = this.downloadProgress({
              chunk,
              downloadedSize,
              contentLength
            })
            // 计算实时网速
            const formattedSpeed = this.downloadNetSpeed(netSpeed, downloadedSize)
            //发送消息
            puppeteerProgressFunc(
              'info',
              downTime,
              `图片${fileName}正在下载,(${formattedSpeed})`,
              progress,
              taskId
            )
          })
          response.data.on('end', () => {
            const taskElapsedTimeMs = Date.now() - dataTime // 计算单个任务耗时（毫秒）
            const taskElapsedTimeSec = Number((taskElapsedTimeMs / 1000).toFixed(2)) // 转换为秒，并保留两位小数得到数字类型
            puppeteerProgressFunc(
              'closed',
              downTime,
              `图片:${fileName}下载完成,耗时${taskElapsedTimeSec}秒`,
              100,
              taskId
            )
            allTime = allTime + taskElapsedTimeSec
            downloadedSize = 0
          })
          // 等待下载完成
          await new Promise<void>((resolve, reject) => {
            writer.on('finish', () => {
              resolve()
            })
            writer.on('error', (error) => {
              puppeteerPrintFunc('error', `下载图片${fileName}失败,请检查vpn或网路是否正常`)
              reject(error)
            })
          })
        } catch (e) {
          console.error('axios请求报错', e)
          puppeteerPrintFunc(
            'error',
            `获取图片${searchData.urlsArray[i]}失败,请检查vpn或网路是否正常`
          )
          throw new Error('下载失败')
        }
      })
      downloadPromises.push(promise)
    }
    //等待所有下载任务完成
    await Promise.all(downloadPromises)
    puppeteerPrintFunc('info', '所有图片下载任务已完成！')
    return allTime
  }
}
export default new PuppeteerCore()
