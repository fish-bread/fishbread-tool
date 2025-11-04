import { ipcMain } from 'electron'
import sharp from 'sharp'
import path from 'path'
import { sharpDialogInter, SharpFileInter, SharpInter } from '../../../types/sharp'
import { exportLeave, fileData, formatSize, qualityLeaveFunc } from './sharpFunc'
import { pathsImgDialog } from '../../dialog/filesDialog'
import { Stats } from 'fs'
import fs from 'fs'
export const sharpIpcHandlers = (): void => {
  //返回文件路径级原文件大小
  ipcMain.handle('sharp-image', async (_event, chooseType: string): Promise<sharpDialogInter> => {
    try {
      const pathFile = await pathsImgDialog(chooseType)
      //选择文件
      if (!pathFile.canceled) {
        //读取原文件
        const stats = fileData(pathFile.filePaths)
        if (stats) {
          console.log('Size大小:', stats)
          //返回对应值
          const fileSize = formatSize(stats, pathFile.filePaths)
          return {
            canceled: pathFile.canceled,
            fileData: fileSize
          }
        } else {
          return {
            canceled: true,
            fileData: null
          }
        }
      }
      //未选择文件
      return {
        canceled: pathFile.canceled,
        fileData: null
      }
    } catch (e) {
      console.error(e)
      throw e
    }
  })
  //处理文件
  ipcMain.handle(
    'sharp-image-change',
    async (
      _event,
      filePath: string[],
      chooseType: string,
      qualityLeave: number
    ): Promise<SharpInter> => {
      try {
        console.log('sharp-image-change', filePath)
        const outputPath: string[] = []
        let stats: Stats[] | null = null
        let fileSize: SharpFileInter[] = []
        //检测图片质量等级
        const imgQualityLeave: exportLeave = qualityLeaveFunc(qualityLeave)
        //循环
        for (let i = 0; i < filePath.length; i++) {
          //使用path模块解析路径
          const parsedPath = path.parse(filePath[i])
          //构建输出目录路径
          const outputDir = path.join(parsedPath.dir, 'output')
          //检查并创建目录（如果不存在）
          if (!fs.existsSync(outputDir)) {
            //recursive: true 允许创建多级目录
            fs.mkdirSync(outputDir, { recursive: true })
          }
          //构建新文件名（例如原文件名 + _sharp + .原文件名）
          const originalExt = parsedPath.ext.toLowerCase()
          const newFileName1 = `${parsedPath.name}_sharp${originalExt}`
          //构建以转换文件名为名(例如原文件名 + _sharp + .type)
          const newFileName2 = `${parsedPath.name}_sharp.${chooseType}`
          //选择转化文件格式
          switch (chooseType) {
            case 'png':
              //组合完整输出路径（保持原目录）
              outputPath.push(path.join(parsedPath.dir, 'output', newFileName2))
              await sharp(filePath[i]).png().toFile(outputPath[i])
              break
            case 'jpg':
              //组合完整输出路径（保持原目录）
              outputPath.push(path.join(parsedPath.dir, 'output', newFileName2))
              await sharp(filePath[i]).jpeg().toFile(outputPath[i])
              break
            case 'all':
              //组合完整输出路径（保持原目录）
              outputPath.push(path.join(parsedPath.dir, 'output', newFileName1))
              //判断
              if (originalExt === '.jpg' || originalExt === '.jpeg') {
                await sharp(filePath[i])
                  .jpeg({
                    quality: imgQualityLeave.jpgLeave
                  })
                  .toFile(outputPath[i])
              } else if (originalExt === '.png') {
                await sharp(filePath[i])
                  .png({
                    compressionLevel: imgQualityLeave.pngLeave
                  })
                  .toFile(outputPath[i])
              } else if (originalExt === '.webp') {
                await sharp(filePath[i])
                  .webp({
                    quality: imgQualityLeave.jpgLeave
                  })
                  .toFile(outputPath[i])
              }
              break
          }
          //读取后文件
          stats = fileData(outputPath)
          console.log('Size大小:', stats)
          //返回相应的值
          if (stats) {
            fileSize = formatSize(stats, outputPath)
          }
        }
        if (stats) {
          return {
            fileData: fileSize,
            success: true
          }
        } else {
          return {
            fileData: null,
            success: false
          }
        }
      } catch (e) {
        console.error(e)
        return {
          fileData: null,
          success: false
        }
      }
    }
  )
}
