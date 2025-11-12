<script setup lang="ts">
import { ref } from 'vue'
import FooterIndex from '@renderer/components/footerIndex.vue'
import { formatMessageWithLinks } from '@renderer/func/linkTextFunc'
// 假设这是你的原始文本内容
const originalText = ref('欢迎访问我的博客网站 https://fishbread.net/ ')

</script>

<template>
  <div class="home-page">
    <div class="home-text">
      <h1>fishbread-tool</h1>
      <h2>这是尝试用electron制作个人米奇妙妙小工具的项目</h2>
      <h3>如果你不在乎性能可以尝试一下,基于electron-vite</h3>
      <div v-dompurify-html="formatMessageWithLinks(originalText)"></div>
      <h3>第一次使用请先到设置中设置一下</h3>
      <FooterIndex />
    </div>
  </div>
</template>

<style scoped lang="scss">
.home-page {
  flex: 1;
  display: flex;
  justify-content: center;
  .home-text {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
