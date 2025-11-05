import BilibiliCookie from './bilibiliCookie'
import {
  bilibiliFfmpegInter,
  cookieInter,
  netSpeedInter,
  puppeteerBilibiliDataInter,
  searchBilibiliInter
} from '../../../../types/mian'
import BasePuppeteer from '../../../general/BasePuppeteer'
import { puppeteerPrintFunc, puppeteerSeparatorPrintFunc } from '../../../general/allPrint'
import baseAxios from '../../../general/BaseAxios'
import BilibiliPath from './bilibiliPath'
import fs from 'fs'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { execSync } from 'child_process'
import { puppeteerProgressFunc } from '../../../general/allProgerss'
import pLimit from 'p-limit'
import dayjs from 'dayjs'
class bilibiliCore extends BasePuppeteer {
  runPuppeteer = async (data: puppeteerBilibiliDataInter): Promise<void> => {
    try {
      puppeteerSeparatorPrintFunc('bilibili脚本')
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
        cookie: BilibiliCookie.getCookies(),
        href: '.bilibili.com'
      }
      //启动浏览器
      await this.startPuppeteer(data, chromePath, cookieData)
      //获取链接
      const bilibiliHref = this.analyzeHrefFunc(data.href)
      if (!bilibiliHref) {
        puppeteerPrintFunc('error', `puppeteer报错,链接无效或找不到视频源`)
        await this.exitPuppeteer()
        return
      }
      puppeteerPrintFunc('info', `原视频链接为${bilibiliHref},正在查询对应数据,,请稍后`)
      const bilibiliLink = await this.searchBilibiliFunc(bilibiliHref)
      if (!bilibiliLink) {
        await this.exitPuppeteer()
      }
      console.log('文件名', bilibiliLink?.videoName)
      //下载函数
      if (bilibiliLink) {
        //创建并发限制器,设置最大并发数2
        const limit = pLimit(2)
        const downloadPromises: Promise<bilibiliFfmpegInter>[] = []
        const videoPromise = limit(() =>
          this.downloadBilibiliAxios(
            bilibiliHref,
            bilibiliLink.videoHref,
            bilibiliLink.videoName,
            'mp4',
            data.useProxy
          )
        )
        downloadPromises.push(videoPromise)
        // 将音频下载任务包装成Promise
        const audioPromise = limit(() =>
          this.downloadBilibiliAxios(
            bilibiliHref,
            bilibiliLink.audioHref,
            bilibiliLink.videoName,
            'mp3',
            data.useProxy
          )
        )
        downloadPromises.push(audioPromise)
        //使用Promise.all,并发执行下载,并等待所有结果
        const [videoResult, audioResult] = await Promise.all(downloadPromises)
        puppeteerPrintFunc(
          'info',
          `puppeteer执行完成,共耗时${videoResult.allTime + audioResult.allTime}秒`
        )
        //合并视频
        const ffmpegTime = await this.ffmpegMergeFunc(
          videoResult.filePath,
          audioResult.filePath,
          bilibiliLink.videoName
        )
        puppeteerPrintFunc('info', `ffmpeg合并完成,共耗时${ffmpegTime}秒`)
        //是否删除原文件
        if (data.deleteChoose) {
          puppeteerPrintFunc('info', `正在删除原文件`)
          fs.unlinkSync(videoResult.filePath)
          fs.unlinkSync(audioResult.filePath)
          puppeteerPrintFunc('info', `源文件删除完成完成`)
        }
      }
      //关闭浏览器实例
      await this.exitPuppeteer()
    } catch (error) {
      puppeteerPrintFunc('error', `puppeteer报错,${error}`)
      await this.exitPuppeteer()
    }
  }
  //分析用户传来的Bilibili视频链接或bv号,统一为标准格式
  analyzeHrefFunc = (href: string): string | null => {
    // 定义匹配B站视频链接的正则表达式
    const bilibiliRegex =
      /^(https:\/\/www\.bilibili\.com\/video\/)?(BV[0-9A-Za-z]{10,12})(\/[^?]*)?(\?.*)?$/
    // 尝试匹配传入的链接
    const match = href.match(bilibiliRegex)
    if (match && match[2]) {
      // 如果匹配成功，提取BV号并构建标准URL
      const bvId = match[2]
      return `https://www.bilibili.com/video/${bvId}/`
    } else {
      // 如果输入无法识别，可以根据需要返回默认值或抛出异常
      console.error('无法从输入中提取有效的链接:', href)
      return null
    }
  }
  //查询网站获取视频链接和标题
  searchBilibiliFunc = async (href: string): Promise<searchBilibiliInter | null> => {
    let audioHref: string = ''
    let videoHref: string = ''
    //打开页面
    await this.page?.goto(href, { waitUntil: 'domcontentloaded' })
    await this.page?.waitForSelector('body', { timeout: 15000 })
    //直接提取音视频
    const playInfo = await this.page?.evaluate(() => {
      return (
        window as unknown as {
          __playinfo__: {
            data: { dash: { audio: [{ baseUrl: string }]; video: [{ baseUrl: string }] } }
          }
        }
      ).__playinfo__
    })
    if (playInfo) {
      audioHref = playInfo?.data?.dash?.audio[0]?.baseUrl
      videoHref = playInfo?.data?.dash?.video[0]?.baseUrl
    }
    await this.page?.waitForSelector('h1.video-title')
    const videoName = await this.page?.$eval('h1.video-title', (title) => {
      return title.innerHTML
    })
    if (!audioHref || !videoHref || !videoName) {
      puppeteerPrintFunc('error', '无法获取完整的视频信息（音频链接、视频链接或标题缺失）')
      return null
    }
    const cleanAudioHref = audioHref.split('?')[0]
    const cleanVideoHref = videoHref.split('?')[0]

    puppeteerPrintFunc('info', `成功查询到音频网址${cleanAudioHref},视频${cleanVideoHref},请稍后`)
    return {
      videoHref: videoHref,
      audioHref: audioHref,
      videoName: this.sanitizeFilename(videoName)
    }
  }
  //下载音频;流和视频流并整合
  downloadBilibiliAxios = async (
    bilibiliHref: string,
    searchHref: string,
    fileName: string,
    fileType: 'mp4' | 'mp3',
    useProxy: boolean
  ): Promise<bilibiliFfmpegInter> => {
    try {
      //获取下载路径
      const downloadDir = BilibiliPath.getPath()
      //检测文件路径是否存在
      if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true })
      }
      const fileLocalName = `${fileName}.${fileType}`
      const filePath = join(downloadDir, fileLocalName)
      puppeteerPrintFunc('info', `文件将保存至目录: ${downloadDir},开始下载${fileType}`)
      //获取下载开始时间
      let allTime: number = 0
      const dataTime: number = Date.now()
      // 用于网速计算的变量
      const netSpeed: netSpeedInter = {
        lastUpdateTime: Date.now(), // 初始化为当前时间
        lastDownloadedSize: 0, // 初始下载量为0
        lastFormattedSpeed: '0.00 KB/s', // 初始显示值
        lastReportTime: 0
      }
      //请求下载
      const pixivAxiosFunc = useProxy ? baseAxios.agentAxios : baseAxios.noAgentAxios
      const response = await pixivAxiosFunc({
        signal: this.cancelToken.signal,
        headers: {
          Referer: bilibiliHref,
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          Cookie: BilibiliCookie.getCookies()
        },
        url: searchHref,
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
        puppeteerProgressFunc(
          'info',
          downTime,
          `文件${fileName}.${fileType}正在下载,(${formattedSpeed})`,
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
          `文件: ${fileName}.${fileType}下载完成,耗时${taskElapsedTimeSec}秒`,
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
          puppeteerPrintFunc('error', `下载文件${fileName}.${fileType}失败,请检查vpn或网路是否正常`)
          reject(error)
        })
      })
      return {
        filePath,
        allTime
      }
    } catch (error) {
      console.error(error)
      throw new Error('下载失败')
    }
  }
  //用子进程ffmapeg执行合并音视频
  ffmpegMergeFunc = async (
    videoPath: string,
    audioPath: string,
    fileName: string
  ): Promise<number> => {
    try {
      const downloadDir = BilibiliPath.getPath()
      const outputPath = join(downloadDir, `${fileName}_合并.mp4`)
      puppeteerPrintFunc('info', '正在使用ffmpeg合并视频,请确报ffmpeg在环境变量中存在')
      const dataTime: number = Date.now()
      //执行命令行
      const stdout = execSync(
        `ffmpeg -i "${videoPath}" -i "${audioPath}" -c:v copy -c:a aac -b:a 192k -map 0:v:0 -map 1:a:0 "${outputPath}"`
      )
      console.log(`标准输出:\n${stdout}`)
      const taskElapsedTimeMs = Date.now() - dataTime // 计算单个任务耗时（毫秒）
      //计算为秒并保留两位
      return Number((taskElapsedTimeMs / 1000).toFixed(2))
    } catch (error) {
      console.log('ffmpeg报错', error)
      puppeteerPrintFunc('error', `无法使用ffmpeg,请确认ffmpeg是否存在,${error}`)
      throw new Error('ffmpeg报错')
    }
  }
}
export default new bilibiliCore()
