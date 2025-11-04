<script setup lang="ts">
import AllFilePath from '@renderer/components/allFilePath.vue'
import { onMounted, ref, inject, Ref } from 'vue'
import { watchThrottled, useElementSize } from '@vueuse/core'
import { theme } from '@renderer/func/themeChange'
import { allProgressInter, allMessageInter, UnifiedMessage } from '../../../types/mian'
import { formatMessageWithLinks } from '@renderer/func/linkTextFunc'
const messageListContainer = ref<HTMLElement | null>(null)
const pythonPrintRef = ref<HTMLElement | null>(null)
const viewportHeightInPixels = window.innerHeight
//引入mess
const mess = inject<Ref<UnifiedMessage[]>>('mess', ref([]))
//滚动
const scrollToBottom = (): void => {
  if (messageListContainer.value) {
    messageListContainer.value.scrollTo({
      top: messageListContainer.value.scrollHeight,
      behavior: 'smooth'
    })
  }
}
//自动滚动
const watchUlFunc = (): void => {
  const { height } = useElementSize(pythonPrintRef)
  watchThrottled(
    height,
    (newValue: number): void => {
      if (newValue > viewportHeightInPixels) {
        scrollToBottom()
      }
    },
    {
      immediate: true,
      throttle: 100
    }
  )
}
// 为每个消息项获取状态文本
const getStatusText = (status: string | undefined): string => {
  switch (status) {
    case 'error':
      return 'error'
    case 'warning':
      return 'warning'
    case 'info':
      return 'info'
    case 'closed':
      return 'closed'
    default:
      return 'undefined'
  }
}
onMounted(() => {
  watchUlFunc()
})
</script>

<template>
  <div class="python-print">
    <AllFilePath />
    <!--输出内容-->
    <div ref="messageListContainer" class="ul-box">
      <ul ref="pythonPrintRef" class="message-list">
        <li
          v-for="(item, index) in mess"
          :key="index"
          :class="{
            error: mess[index].data.status === 'error',
            success: mess[index].data.status === 'info',
            closed: mess[index].data.status === 'closed',
            warning: mess[index].data.status === 'warning'
          }"
          :style="{
            '--success-color': theme === null ? '#2c2c2c' : '#ffffff'
          }"
        >
          <template v-if="item.type === 'text'">
            <div class="text-message">
              <div class="status-text">
                {{ getStatusText(item.data.status) }}
              </div>
              <div class="dataTime-text">
                {{ (item.data as allMessageInter).dataTime }}
              </div>
              <div class="message-text">
                <div
                  v-dompurify-html="formatMessageWithLinks((item.data as allMessageInter).message)"
                  class="message-text"
                />
              </div>
            </div>
          </template>
          <template v-if="item.type === 'progress'">
            <div class="text-message">
              <div class="status-text">
                {{ getStatusText(item.data.status) }}
              </div>
              <div class="dataTime-text">
                {{ (item.data as allProgressInter).dataTime }}
              </div>
              <div class="message-text">
                <div
                  v-dompurify-html="formatMessageWithLinks((item.data as allProgressInter).message)"
                  class="message-text"
                />
              </div>
            </div>
            <n-progress
              :style="{
                maxWidth: '90%'
              }"
              type="line"
              color="#8064a9"
              :percentage="(item.data as allProgressInter).progress"
            />
          </template>
          <template v-if="item.type === 'separator'">
            <div class="separator-text">
              <div>
                ----------------------------{{ item.data.message }}----------------------------
              </div>
            </div>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.python-print {
  flex: 1;
  max-width: calc(100vw - 320px - 70px);
}
.ul-box {
  height: calc(100vh - 50px - 23px);
  overflow: auto;
  font-size: 16px;
}
.message-list {
  display: flex;
  flex-direction: column-reverse;
  min-height: 100%;
}
ul,
li {
  list-style-type: none;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  .error {
    color: var(--error-color) !important;
  }
  .success {
    color: var(--success-color) !important;
  }
  .closed {
    color: var(--closed-color) !important;
  }
  .warning {
    color: var(--warning-color) !important;
  }
}
ul {
  padding: 0 0 0 20px;
  font-size: 14px;
  flex: 1;
}
li {
  margin-bottom: 5px;
  transition: color 0.2s ease;
}
.text-message {
  display: grid;
  grid-template-columns: 60px 190px auto;
}
.separator-text {
  display: flex;
  justify-content: center;
}
</style>
