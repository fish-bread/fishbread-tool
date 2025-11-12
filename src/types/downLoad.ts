export interface downloadProgressInter {
  value: number
  title: string
  status: 'progressing' | 'completed' | 'cancelled' | 'interrupted' | 'error'
  uuid: string
  speed: string
  isStop: boolean
}
export interface downloadListInter {
  item: Electron.DownloadItem
  uuid: string
}
