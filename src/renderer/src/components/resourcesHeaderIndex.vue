<script setup lang="ts">
import Subtract20Regular from '@vicons/fluent/Subtract20Regular'
import Maximize20Regular from '@vicons/fluent/Maximize20Regular'
import Dismiss20Regular from '@vicons/fluent/Dismiss20Regular'
import Star20Regular from '@vicons/fluent/Star20Regular'
import { theme } from '@renderer/func/themeChange'
import { sendPost } from '../../../types/ru34'
import { useMessage } from 'naive-ui'
const message = useMessage()
//最大化
const maxSizeFunc = (): void => window.api.maxSizeFunc()
//最小化
const minimizeFunc = (): void => window.api.minimizeFunc()
//关闭
const closeWindowFunc = (): void => {
  window.api.closeWindowFunc()
}
//加入收藏
const addFavorite = async (): Promise<void> => {
  if (post.postData) {
    message.loading('正在加入收藏')
    // 创建纯数据对象
    const postData: sendPost = {
      preview_url: post.postData.preview_url,
      sample_url: post.postData.sample_url,
      file_url: post.postData.file_url,
      id: post.postData.id
    }
    const success = await window.ru34Api.addRu34Favorite(postData)
    if (success) {
      message.success('收藏成功')
    } else {
      message.error('收藏失败,当前资源已收藏')
    }
  }
}
const post = defineProps<{
  iconSize: string
  postData: sendPost | null
}>()
</script>

<template>
  <div
    class="windows-drag"
    :style="{
      backgroundColor: theme === null ? '#ffffff' : '#2c2c2c'
    }"
    :data-theme="theme === null ? 'light' : 'dark'"
  >
    <div class="app-drag window-left"></div>
    <div class="window-right">
      <div class="control-button cursorPointer" title="收藏" @click="addFavorite">
        <n-icon :size="iconSize">
          <Star20Regular />
        </n-icon>
      </div>
      <div class="control-button cursorPointer" title="最小化" @click="minimizeFunc">
        <n-icon :size="iconSize">
          <Subtract20Regular />
        </n-icon>
      </div>
      <div class="control-button cursorPointer" title="控制窗体" @click="maxSizeFunc">
        <n-icon :size="iconSize">
          <Maximize20Regular />
        </n-icon>
      </div>
      <div class="control-button cursorPointer close" title="关闭窗体" @click="closeWindowFunc">
        <n-icon :size="iconSize">
          <Dismiss20Regular />
        </n-icon>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.windows-drag {
  display: flex;
  align-items: center;
  gap: 0;
  .window-left {
    flex: 1;
    width: 100%;
    height: 40px;
  }
  .window-right {
    display: flex;
    flex-direction: row;
  }
}
.control-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  transition: all 0.2s ease;
  &:hover {
    background-color: var(--button-hover-color);
  }
}
.close {
  &:hover {
    background-color: #c42b1c !important;
  }
}
</style>
