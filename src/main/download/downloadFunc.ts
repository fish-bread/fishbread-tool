import { BrowserWindow } from 'electron'
import { readWindow } from '../window/windowManager'
import { downloadListInter, downloadProgressInter } from '../../types/downLoad'
import { v4 as uuidv4 } from 'uuid'
import DownloadPath from './downloadPath'
import { join } from 'path'
import BasePuppeteer from '../general/BasePuppeteer'
const basePuppereer = new BasePuppeteer()
//定义网速计算所需的接口
interface netSpeedInter {
  lastReportTime: number
  lastUpdateTime: number
  lastDownloadedSize: number
  lastFormattedSpeed: string
}
class downloadClass {
  private downloadList: downloadListInter[] = []
  //添加下载任务到下载列表
  addDownloadList = (downloadItem: downloadListInter): void => {
    this.downloadList.push(downloadItem)
  }
  //监听chrome下载事件
  watchDownload = (window: BrowserWindow): void => {
    //用于存储每个下载任务的网速计算状态
    const netSpeedMap = new Map<string, netSpeedInter>()
    window.webContents.session.on('will-download', (_event, item): void => {
      item.setSavePath(join(DownloadPath.getPath(), item.getFilename()))
      //生成唯一uuid
      const taskId = uuidv4()
      //添加到下载列表
      this.addDownloadList({
        item: item,
        uuid: taskId
      })
      const downLoadWindow = readWindow('downloadWindow')
      const chromeWindow = readWindow('chromeWindow')
      //为当前下载任务初始化网速计算状态
      const initialNetSpeedState: netSpeedInter = {
        lastReportTime: Date.now(),
        lastUpdateTime: Date.now(),
        lastDownloadedSize: 0, //初始已下载字节数
        lastFormattedSpeed: '0.00 KB/s'
      }
      netSpeedMap.set(taskId, initialNetSpeedState)
      //创建进度数据结构
      let downloadItem: downloadProgressInter = {
        value: 0, // 初始进度为0
        title: item.getFilename(), //使用文件名作为标题
        status: 'progressing', //初始状态
        uuid: taskId,
        speed: '0.00 KB/s', //下载速度
        isStop: false
      }
      console.log('下载任务:', downloadItem)
      //监听下载进度更新
      item.on('updated', (_event, state) => {
        const receivedBytes = item.getReceivedBytes()
        const totalBytes = item.getTotalBytes()
        //计算下载进度百分比
        const progress = totalBytes > 0 ? Math.round((receivedBytes / totalBytes) * 100) : 0
        //获取当前任务的网速状态
        const currentNetSpeedState = netSpeedMap.get(taskId)
        if (currentNetSpeedState) {
          //计算当前网速
          const currentSpeedText = basePuppereer.downloadNetSpeed(
            currentNetSpeedState,
            receivedBytes
          )
          //更新网速状态到Map中
          netSpeedMap.set(taskId, currentNetSpeedState)
          downloadItem = {
            value: progress,
            title: item.getFilename(),
            status: state,
            uuid: taskId,
            speed: currentSpeedText, // 添加网速信息
            isStop: false
          }
          //监听是否暂停
          if (item.isPaused() && state === 'progressing') {
            downloadItem = {
              value: progress,
              title: item.getFilename(),
              status: 'interrupted',
              uuid: taskId,
              speed: currentSpeedText, // 添加网速信息
              isStop: true
            }
          }
          console.log(`进度: ${progress}%, 速度: ${currentSpeedText}`)
          //发送进度更新到渲染进程
          downLoadWindow?.webContents.send('send-download-item', downloadItem)
        }
        console.log('状态', state)
      })
      //监听完成
      item.once('done', (_event, state) => {
        downloadItem = {
          value: state === 'completed' ? 100 : 0,
          title: item.getFilename(),
          status: state,
          uuid: taskId,
          speed: '0.00 KB/s',
          isStop: true
        }
        if (state === 'interrupted') {
          downloadItem.status = 'error'
        }
        //移除对象
        netSpeedMap.delete(taskId)
        console.log(`下载${state === 'completed' ? '成功' : '失败'}: ${item.getFilename()}`)
        //发送最终状态到渲染进程
        downLoadWindow?.webContents.send('send-download-item', downloadItem)
      })
      console.log('监听')
      downLoadWindow?.webContents.send('send-download-item', downloadItem)
      chromeWindow?.webContents.send('downloadWindow-close', true)
      downLoadWindow?.show()
      downLoadWindow?.focus()
    })
  }
  //暂停单个任务
  stopDownload = (uuid: string): void => {
    const item = this.downloadList.find((item) => item.uuid === uuid)
    item?.item.pause()
    console.log(`暂停, ${uuid}`)
  }
  //继续单个任务
  playDownload = (uuid: string): void => {
    const item = this.downloadList.find((item) => item.uuid === uuid)
    item?.item.resume()
    console.log(`继续, ${uuid}`)
  }
  //取消单个任务
  cancelledDownload = (uuid: string): void => {
    const item = this.downloadList.find((item) => item.uuid === uuid)
    item?.item.cancel()
    console.log(`关闭, ${uuid}`)
  }
}
export default new downloadClass()
