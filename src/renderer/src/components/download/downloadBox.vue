<script setup lang="ts">
import { downloadProgressInter } from '../../../../types/downLoad'
import PlayCircle20Regular from '@vicons/fluent/PlayCircle20Regular'
import RecordStop20Regular from '@vicons/fluent/RecordStop20Regular'
import DismissCircle20Regular from '@vicons/fluent/DismissCircle20Regular'
const stop = (bool: boolean, uuid: string): void => {
  const data = props.downloadProgress.find((item) => item.uuid === uuid)
  if (data) {
    data.isStop = bool
    if (data?.isStop === true) {
      //暂停
      window.downloadApi.stopDownload(uuid)
    } else {
      //继续
      window.downloadApi.playDownload(uuid)
    }
  }
}
const cancelled = (uuid: string): void => {
  window.downloadApi.cancelledDownload(uuid)
}
const props = defineProps<{
  downloadProgress: downloadProgressInter[]
}>()
</script>

<template>
  <div v-for="(item, index) in downloadProgress" :key="index" class="download">
    <div class="head-text" style="width: 100%">
      <div style="max-width: 90%; overflow: hidden">{{ item.title }}</div>
      <!--取消按钮-->
      <n-icon
        v-show="
          item.status !== 'completed' && item.status !== 'error' && item.status !== 'cancelled'
        "
        title="取消下载"
        class="cursorPointer"
        size="20"
        @click="cancelled(item.uuid)"
      >
        <DismissCircle20Regular />
      </n-icon>
      <div
        v-show="
          item.status !== 'completed' && item.status !== 'error' && item.status !== 'cancelled'
        "
      >
        {{ item.speed }}
      </div>
    </div>
    <div class="progress-box">
      <n-progress style="width: 81%" color="#8064a9" type="line" :percentage="item.value" />
      <div class="button-icon">
        <!--暂停时-->
        <n-icon
          v-show="item.status === 'interrupted'"
          title="继续"
          class="cursorPointer"
          size="25"
          @click="stop(false, item.uuid)"
        >
          <PlayCircle20Regular />
        </n-icon>
        <!--继续时-->
        <n-icon
          v-show="item.status === 'progressing'"
          title="暂停"
          class="cursorPointer"
          size="25"
          @click="stop(true, item.uuid)"
        >
          <RecordStop20Regular />
        </n-icon>
        <div v-show="item.status === 'completed'">已完成</div>
        <div v-show="item.status === 'error'">下载出错</div>
        <div v-show="item.status === 'cancelled'">下载已取消</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.download {
  box-sizing: border-box;
  border: 1px solid #8064a9;
  padding: 0 3px;
}
.head-text {
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 10px;
}
.progress-box {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.button-icon {
  display: flex;
  align-items: center;
}
</style>
