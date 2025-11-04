<script setup lang="ts">
import AllSelect from '@renderer/components/allSelect.vue'
import ScriptControl from '@renderer/components/Script/scriptControl.vue'
import PuppeteerPixivControl from '@renderer/components/Script/puppeteerPixiv/puppeteerPixivControl.vue'
import puppeteerBilibiliControl from '@renderer/components/Script/puppeteerBilibili/puppeteerBilibiliControl.vue'
import AllPrint from '@renderer/components/allPrint.vue'
import { onMounted, provide, ref } from 'vue'
import type {
  allMessageInter,
  allProgressInter,
  allSeparatorInter,
  UnifiedMessage
} from '../../../../types/mian'
import { theme } from '@renderer/func/themeChange'
const jsMess = ref<UnifiedMessage[]>([])
const time = ref<string>('3')
//设置路径名
const pathName = ref<string>('谷歌浏览器')
//依赖
provide('pathName', pathName)
provide('mess', jsMess)
provide('time', time)
//设置components
const JsComponents = [PuppeteerPixivControl, puppeteerBilibiliControl]
const puppeteerOptions = ref([
  {
    label: 'pixiv爬虫',
    value: 0
  },
  {
    label: 'bilibili爬虫',
    value: 1
  }
])
const num = ref<number>(0)
provide('num', num)
provide('options', puppeteerOptions)
//监听message消息和进度条
const handleOutputMessage = (message: allMessageInter): void => {
  console.log('接收到pythonOutput消息:', message)
  jsMess.value.unshift({
    type: 'text',
    data: message
  })
}
const handleOutputSeparator = (message: allSeparatorInter): void => {
  console.log('接收到SeparatorOutput消息:', message)
  jsMess.value.unshift({
    type: 'separator',
    data: message
  })
}
const handleProgressUpdate = (message: allProgressInter): void => {
  if (!message.taskId) return
  // 查找是否已存在该任务
  const existingTaskIndex = jsMess.value.findIndex(
    (item) => item.type === 'progress' && (item.data as allProgressInter).taskId === message.taskId
  )
  if (existingTaskIndex >= 0) {
    // 更新现有任务
    ;(jsMess.value[existingTaskIndex].data as allProgressInter).progress = message.progress
    ;(jsMess.value[existingTaskIndex].data as allProgressInter).message = message.message
    jsMess.value[existingTaskIndex].data.status = message.status
  } else {
    // 添加新任务
    jsMess.value.unshift({
      type: 'progress',
      data: message
    })
  }
}
onMounted(() => {
  // 注册监听器，持续接收主进程发来的 pythonOutput 消息
  window.api.puppeteerOutput(handleOutputMessage)
  window.api.puppeteerOutProgress(handleProgressUpdate)
  window.api.puppeteerSeparatorOutput(handleOutputSeparator)
})
</script>

<template>
  <div
    class="script-page"
    :style="{ borderRight: theme === null ? '1px solid #4e4e4e' : '1px solid  #2c2c2c' }"
    :data-theme="theme === null ? 'light' : 'dark'"
  >
    <div class="script-box">
      <AllSelect name="js" />
      <ScriptControl />
      <KeepAlive>
        <Component :is="JsComponents[num]" />
      </KeepAlive>
    </div>
  </div>
  <AllPrint />
</template>

<style scoped>
.script-page {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: calc(100vh - 50px);
  padding: 0 10px;
  min-width: 320px;
  max-width: 320px;
}
.script-page::-webkit-scrollbar {
  width: 5px;
}
.script-box {
  box-sizing: border-box;
}
</style>
