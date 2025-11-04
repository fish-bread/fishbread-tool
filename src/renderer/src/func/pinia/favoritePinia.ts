import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'
import { sendPost } from '../../../../types/ru34'
export const useFavoriteStore = defineStore('FavoriteSetting', () => {
  const FavoriteList = ref<sendPost[] | []>([])
  onMounted(async () => {
    FavoriteList.value = await window.ru34Api.favoriteList()
  })
  return {
    FavoriteList
  }
})
