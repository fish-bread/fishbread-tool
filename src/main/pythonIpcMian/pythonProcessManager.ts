//python进程
import { PythonShell } from 'python-shell'
import { ipcMain } from 'electron'
import { pythonPrintFunc, pythonSeparatorPrintFunc } from '../general/allPrint'
import airtestPythonPath from '../pythonIpcMian/airtestPython/airtestPythonPath'
export let PyShell: PythonShell | null = null
export const registerPythonIpcHandlers = (): void => {
  // 运行python
  ipcMain.on('runPython', async (_event, time): Promise<void> => {
    pythonSeparatorPrintFunc('python脚本')
    //检测是否存在进程
    if (PyShell) {
      pythonPrintFunc('error', 'python脚本正在执行,请勿重复启动')
      return
    }
    //开始运行python
    //获取python路径
    const pythonScriptPath = airtestPythonPath.getPath()
    if (!pythonScriptPath || !pythonScriptPath.endsWith('.py')) {
      pythonPrintFunc('error', `该路径不是一个有效的python脚本路径`)
      return
    }
    console.log('Python脚本路径:', pythonScriptPath)
    PyShell = new PythonShell(pythonScriptPath, {
      encoding: 'utf-8',
      pythonOptions: ['-u'] //让打印流直接打印
    })
    //发送消息
    PyShell.send(time)
    //接收消息
    PyShell.on('message', function (message) {
      console.log('监听事件', message)
      pythonPrintFunc('info', message)
    })
    //结束发送以执行python
    PyShell.end((res) => {
      console.log(res)
    })
    //python关闭
    PyShell.on('close', () => {
      pythonPrintFunc('closed', `python脚本正常关闭`)
      PyShell = null
    })
    //python异常报错
    PyShell.on('pythonError', (err) => {
      pythonPrintFunc('error', `python脚本异常关闭,${err}`)
      PyShell = null
    })
    //python报错
    PyShell.on('error', (err) => {
      console.log('python报错', err)
      pythonPrintFunc('error', `python异常报错, ${err}`)
      PyShell = null
    })
  })
  //killPython进程
  ipcMain.on('killPython', (): void => {
    if (PyShell) {
      PyShell.kill()
      PyShell = null
      pythonPrintFunc('info', 'python脚本已强制终止')
    } else {
      pythonPrintFunc('info', 'python子进程未启动')
    }
  })
  //获取python路径
  ipcMain.handle('getPythonPath', async (): Promise<string> => {
    return airtestPythonPath.getPath()
  })
}
