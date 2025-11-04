import { Ref, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { SharpFileInter, showImgInter, sharpDialogInter } from '../../../../../../types/sharp'
interface UseSharpReturn {
  // 数据
  fileData: Ref<SharpFileInter[] | null>
  fileImg: Ref<string[]>
  showImgData: Ref<showImgInter[] | null>
  userDialog: Ref<sharpDialogInter | null>
  primitiveType: Ref<string>
  changeType: Ref<string>
  // 方法
  choose: (type: string) => Promise<void>
  change: (ype: string, qualityLeave: number) => Promise<void>
  showFunc: (
    success: boolean,
    fileData: SharpFileInter[] | null,
    fileImg: string[]
  ) => showImgInter[] | null
  clean: () => void
}
export const useSharp = (): UseSharpReturn => {
  const message = useMessage()

  // 响应式数据
  const fileData = ref<SharpFileInter[] | null>(null)
  const fileImg = ref<string[]>([])
  const showImgData = ref<showImgInter[] | null>(null)
  const userDialog = ref<sharpDialogInter | null>(null)
  //选择文件类型
  const primitiveType = ref<string>('png')
  const changeType = ref<string>('jpg')
  //选择文件
  const choose = async (Type: string): Promise<void> => {
    clean()
    userDialog.value = await window.sharpApi.sharpImage(Type)
    fileData.value = userDialog.value.fileData
    if (userDialog.value.canceled) {
      message.error('用户取消选择文件')
    } else if (!userDialog.value.canceled && userDialog.value.fileData && fileData.value) {
      fileImg.value = []
      for (let i = 0; i < userDialog.value.fileData?.length; i++) {
        fileImg.value.push(await window.api.pathToFileURL(fileData.value[i].filePath as string))
      }
      //添加显示
      showImgData.value = showFunc(false, fileData.value, fileImg.value)
      message.success('图片选择成功')
    }
  }

  //构建显示函数
  const showFunc = (
    success: boolean,
    fileData: SharpFileInter[] | null,
    fileImg: string[]
  ): showImgInter[] | null => {
    if (fileData) {
      return fileData.map((file, index) => ({
        fileData: {
          ...file,
          filePath: file.filePath ? file.filePath.split(/[\\/]/).pop() || '' : null
        },
        success: success,
        imgPath: fileImg[index] || ''
      }))
    } else {
      return null
    }
  }

  //修改图片
  const change = async (type: string, qualityLeave: number): Promise<void> => {
    if (fileData.value !== null) {
      message.loading('图片正在修改,请稍后')
      const dataPath: (string | null)[] = fileData.value.map((list) => {
        return list.filePath
      })
      const success = await window.sharpApi.sharpImageChange(
        dataPath as string[],
        type,
        qualityLeave
      )
      if (success.success || success.fileData) {
        fileData.value = success.fileData
        fileImg.value = []
        //检查是否为空
        if (!fileData.value || fileData.value.length === 0) {
          message.error('图片列表为空')
          return
        } else {
          for (let i = 0; i < fileData.value?.length; i++) {
            fileImg.value.push(await window.api.pathToFileURL(fileData.value[i].filePath as string))
            console.log('文件路径', fileImg.value, '文件1', fileData.value[i].filePath)
          }
          //添加显示
          showImgData.value = showFunc(success.success, fileData.value, fileImg.value)
          message.success('图片修改成功')
        }
      } else {
        message.error('图片修改失败')
      }
    } else {
      message.error('图片列表为空')
    }
  }
  //清除
  const clean = (): void => {
    fileImg.value = []
    fileData.value = null
    showImgData.value = null
    message.success('文件清除成功')
  }

  return {
    // 数据
    fileData,
    fileImg,
    showImgData,
    userDialog,
    primitiveType,
    changeType,
    // 方法
    choose,
    change,
    showFunc,
    clean
  }
}
