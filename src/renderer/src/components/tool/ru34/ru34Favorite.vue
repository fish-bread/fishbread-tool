<script setup lang="ts">
import { sendPost } from '../../../../../types/ru34'
import { onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { useFavoriteStore } from '@renderer/func/pinia/favoritePinia'
const message = useMessage()
const favoriteStore = useFavoriteStore()
//监听喜欢列表
const handleFavorite = (data: sendPost[]): void => {
  favoriteStore.FavoriteList = data
}
//清除单个列表
const removeFavorite = async (id: number): Promise<void> => {
  favoriteStore.FavoriteList = await window.ru34Api.removeFavoriteList(id)
  message.success('删除成功')
}
//打开显示窗体
const showFile = (fileData: sendPost): void => {
  const sendPost: sendPost = {
    preview_url: fileData.preview_url,
    sample_url: fileData.sample_url,
    file_url: fileData.file_url,
    id: fileData.id
  }
  window.api.showResources(sendPost)
}
onMounted(async () => {
  window.ru34Api.handleFavoriteList(handleFavorite)
})
</script>

<template>
  <div>
    <div v-show="!favoriteStore.FavoriteList || favoriteStore.FavoriteList?.length >= 0">
      <div
        v-for="(item, index) in favoriteStore.FavoriteList"
        :key="index"
        class="favorite-list-li"
      >
        <div>{{ index + 1 }}.</div>
        <div>{{ item.file_url }}</div>
        <div class="post-media">
          <img
            :src="item.sample_url"
            :alt="`${item.sample_url}显示失败,请检测网络`"
            loading="lazy"
          />
        </div>
        <div class="favorite-list-li-file">
          资源类型:&nbsp;
          <div v-if="item.file_url.endsWith('.mp4')">视频</div>
          <div v-else>图片</div>
        </div>
        <n-button @click="showFile(item)">查看</n-button>
        <n-button @click="removeFavorite(item.id)">删除</n-button>
      </div>
    </div>
    <div v-show="favoriteStore.FavoriteList?.length === 0">还没有收藏</div>
  </div>
</template>

<style scoped>
.favorite-list-li {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  .favorite-list-li-file {
    display: flex;
    flex-direction: row;
  }
}
.post-media {
  border-radius: 4px;
  overflow: hidden;
  background: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 50px;
  max-height: 50px;
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
