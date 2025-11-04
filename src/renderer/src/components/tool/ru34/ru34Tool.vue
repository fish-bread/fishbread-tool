<script setup lang="ts">
import ru34Home from '@renderer/components/tool/ru34/ru34Home.vue'
import ru34Favorite from '@renderer/components/tool/ru34/ru34Favorite.vue'
import toolControl from '@renderer/components/toolControl.vue'
import { pageTitleInter } from '../../../../../types/renderer'
import { ref } from 'vue'
//切换页面
const setting_title = ref<pageTitleInter[]>([
  { title: 'ru34主页', value: 0 },
  { title: '我的收藏', value: 1 }
])
const num = ref<number>(0)
</script>

<template>
  <div class="ru34">
    <toolControl v-model:num="num" v-model:title="setting_title" />
    <ru34Home v-show="num === 0" />
    <ru34Favorite v-show="num === 1" />
  </div>
</template>

<style scoped lang="scss">
.ru34 {
  width: 100%;
  overflow: hidden;
}
</style>
