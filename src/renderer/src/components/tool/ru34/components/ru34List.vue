<script setup lang="ts">
import { ApiResponse, Post, sendPost } from '../../../../../../types/ru34'
import PlayCircleRegular from '@vicons/fa/PlayCircleRegular'
defineProps<{
  ru34Data: ApiResponse | null
}>()
// 格式化时间显示
const formatTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleString()
}
//显示资源页面
const showResource = (Post: Post): void => {
  const sendPost: sendPost = {
    preview_url: Post.preview_url,
    sample_url: Post.sample_url,
    file_url: Post.file_url,
    id: Post.id
  }
  window.api.showResources(sendPost)
}
/* 获取视频缩略图或预览图
const getThumbnailUrl = (post: Post): string => {
  return post.preview_url || post.sample_url || '/default-thumbnail.jpg'
}*/
</script>

<template>
  <div v-if="ru34Data" class="api-result">
    <h3 style="margin: 5px 0">共获取 {{ ru34Data?.posts.length }} 个帖子</h3>
    <div class="ru34-show-box">
      <div class="posts-grid">
        <div v-for="(post, index) in ru34Data?.posts" :key="post.id" class="post-card">
          <div class="post-header">
            <h4>帖子 {{ index + 1 }} (ID: {{ post.id }})</h4>
            <span class="rating" :class="post.rating.toLowerCase()">
              评分: {{ post.rating.toUpperCase() }}
            </span>
          </div>
          <div class="post-media">
            <div class="cursorPointer" @click="showResource(post)">
              <div v-if="post?.file_url.endsWith('.mp4')" class="video-show-box">
                <img :src="post?.sample_url" :alt="`${post?.sample_url}显示失败,请检测网络`" />
                <n-icon class="video-show-box-icon" size="50" color="#ffffff">
                  <PlayCircleRegular />
                </n-icon>
              </div>
              <img
                v-else
                :src="post?.sample_url"
                :alt="`${post?.sample_url}显示失败,请检测网络`"
                loading="lazy"
              />
            </div>
          </div>
          <div class="post-images">
            <div class="image-link">
              <strong>预览图:</strong>
              <a :href="post.preview_url" rel="noopener noreferrer">
                {{ post.preview_url }}
              </a>
            </div>
            <div class="image-link">
              <strong>样本图:</strong>
              <a :href="post.sample_url" rel="noopener noreferrer">
                {{ post.sample_url }}
              </a>
            </div>
            <div class="image-link">
              <strong>原图:</strong>
              <a :href="post.file_url" rel="noopener noreferrer">
                {{ post.file_url }}
              </a>
            </div>
          </div>
          <div class="post-info">
            <p><strong>尺寸:</strong> {{ post.width }} × {{ post.height }} 像素</p>
            <p><strong>评分:</strong> {{ post.score }}</p>
            <p>
              <strong>标签:</strong>
              <span class="tags">{{ post.tags }}</span>
            </p>
            <p><strong>创建时间:</strong> {{ formatTime(post.change) }}</p>
            <p>
              <strong>来源:</strong>
              <a v-if="post.source" :href="post.source" rel="noopener noreferrer">
                {{ post.source }}
              </a>
              <span v-else>无</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.api-result {
  margin-top: 20px;
  .ru34-show-box {
    height: 550px;
    width: 90%;
    overflow-y: auto;
    margin: 0 auto;
    &::-webkit-scrollbar {
      height: 5px;
      width: 5px;
    }
    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 20px;
      padding: 10px;
    }
  }
}
.post-card {
  box-sizing: border-box;
  border-radius: 8px;
  padding: 16px;
  background: var(--button-hover-color);
  transition: transform 0.2s;
  overflow: hidden;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  .post-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 8px;
    h4 {
      margin: 0;
      font-size: 16px;
    }
    .rating {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      &.explicit {
        background-color: #ff4757;
        color: white;
      }
      &.questionable {
        background-color: #ffa502;
        color: white;
      }
      &.safe {
        background-color: #2ed573;
        color: white;
      }
    }
  }
  .post-media {
    margin-bottom: 12px;
    border-radius: 4px;
    overflow: hidden;
    background: #000;
    video,
    img {
      width: 100%;
      height: auto;
      display: block;
      max-height: 250px;
      object-fit: contain;
    }
  }
  .post-images {
    margin-bottom: 12px;
    .image-link {
      margin-bottom: 6px;
      font-size: 13px;
    }
  }
  .post-info {
    font-size: 14px;
    p {
      margin: 6px 0;
      line-height: 1.5;
    }
    .tags {
      display: inline-block;
      background: var(--tab-active-color);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
      line-height: 1.4;
    }
  }
}
.video-show-box {
  position: relative;
  .video-show-box-icon {
    position: absolute;
    z-index: 10;
    top: 45%;
    left: 45%;
  }
}
</style>
