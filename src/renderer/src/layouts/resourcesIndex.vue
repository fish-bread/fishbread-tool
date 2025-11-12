<script setup lang="ts">
import 'vidstack/bundle'
import defaultHeaderIndex from '@renderer/components/resourcesHeaderIndex.vue'
import { onBeforeMount, onMounted, ref } from 'vue'
import { sendTheme } from '@renderer/func/themeChange'
import { sendPost } from '../../../types/ru34'
const post = ref<sendPost | null>(null)
const mess = (path: sendPost): void => {
  console.log('路径对象', path)
  post.value = path
}
// 获取视频缩略图或预览图
const getThumbnailUrl = (post: sendPost): string => {
  return post.preview_url || post.sample_url || '/default-thumbnail.jpg'
}
const downloadFunc = (url: string): void => {
  window.downloadApi.openResourcesDownloadUrl(url)
}
onBeforeMount(() => {
  window.api.sendTheme(sendTheme)
})
onMounted(() => {
  window.api.resourcesPath(mess)
})
</script>

<template>
  <defaultHeaderIndex icon-size="20" :post-data="post" />
  <div style="display: flex; flex-direction: row; align-items: center;">
    <div>
      资源地址:&nbsp;<a :href="post?.file_url">{{ post?.file_url }}</a>
    </div>
    <n-button @click="downloadFunc(post?.file_url as string)">下载</n-button>
  </div>
  <div class="post-media">
    <media-player
      v-if="post?.file_url.endsWith('.mp4')"
      :src="post?.file_url"
      :poster="getThumbnailUrl(post)"
    >
      <media-provider></media-provider>
      <media-video-layout></media-video-layout>
    </media-player>
    <img
      v-else
      :src="post?.file_url"
      :alt="`${post?.file_url}显示失败,请检测网络`"
      loading="lazy"
    />
  </div>
</template>

<style scoped lang="scss">
.post-media {
  border-radius: 4px;
  overflow: hidden;
  background: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 800px;
  max-height: 600px;
  margin: 0 auto;
  video,
  img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    display: block;
    object-fit: contain;
  }
}
</style>
