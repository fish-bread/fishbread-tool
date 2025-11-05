<script setup lang="ts">
import { ApiResponse, TabsResponse } from '../../../../../../types/ru34'
import { useGeneralStore } from '@renderer/func/pinia/generalPinia'
const generalStore = useGeneralStore()
import { watchDebounced } from '@vueuse/core'
import { useMessage } from 'naive-ui'
import { extractChineseErrorMessage } from '@renderer/func/ErrorHandle'
const message = useMessage()
const tabs = defineModel<string>('tabs')
const agent = defineModel<boolean>('agent')
const options = defineModel<TabsResponse[]>('options')
const activeTabIds = defineModel<Set<string>>('activeTabIds')
const searchTabs = defineModel<Array<string>>('searchTabs')
const ru34Data = defineModel<ApiResponse | null>('ru34Data')
//请求函数
const ru34Func = async (): Promise<void> => {
  try {
    if (searchTabs.value !== undefined && agent.value !== undefined) {
      message.loading('请求中列表,请稍后')
      ru34Data.value = await window.ru34Api.ru34Search({
        tabs: searchTabs.value.join('+'),
        useProxy: agent.value
      })
      console.log('API 返回的数据:', ru34Data.value)
      message.success('请求成功')
    }
  } catch (error) {
    console.error('请求列表错误:', error)
    message.error(extractChineseErrorMessage(error))
  }
}
//监听文本变化
watchDebounced(
  () => tabs.value ?? '',
  async (value: string) => {
    try {
      if (value === '') {
        return
      }
      if (agent.value !== undefined) {
        message.loading('获取标签中,请稍后')
        const newTabsList = await window.ru34Api.ru34SearchTabs({
          tabs: value,
          useProxy: agent.value
        })
        console.log('新文本', newTabsList)
        options.value = newTabsList
        message.success('查询成功')
      }
    } catch (error) {
      console.error('获取标签失败:', error)
      message.error(extractChineseErrorMessage(error))
    }
  },
  { debounce: 2000 }
)
// 点击标签的处理方法
const handleTabClick = (item: TabsResponse): void => {
  if (activeTabIds.value !== undefined && searchTabs.value !== undefined) {
    if (activeTabIds.value.has(item.value)) {
      // 如果已选中，则取消选中
      activeTabIds.value.delete(item.value)
      // 从searchTabs中移除对应的value
      const index = searchTabs.value.indexOf(item.value)
      if (index > -1) {
        searchTabs.value.splice(index, 1)
      }
    } else {
      // 如果未选中，则添加到选中集合
      activeTabIds.value.add(item.value)
      // 添加到searchTabs数组[3,5](@ref)
      searchTabs.value.push(item.value)
    }
  }
}
// 点击已选标签的处理方法
const handleSearchTabClick = (tabValue: string, index: number): void => {
  if (activeTabIds.value !== undefined && searchTabs.value !== undefined) {
    // 从 searchTabs 数组中删除对应的标签[3,7](@ref)
    searchTabs.value.splice(index, 1)
    // 从 activeTabIds 集合中移除对应的ID[1](@ref)
    activeTabIds.value.delete(tabValue)
    console.log('删除标签:', tabValue, '剩余标签:', searchTabs.value)
  }
}
// 清空所有选中的标签
const clearAllTabs = (): void => {
  if (activeTabIds.value !== undefined) {
    activeTabIds.value.clear()
    searchTabs.value = []
    message.success('清空成功')
  }
}
</script>

<template>
  <div class="search-all">
    <h1>RU34.XXX</h1>
    <!--搜索盒子-->
    <div class="search-box">
      <n-input
        v-model:value="tabs"
        placeholder="输入提示词2秒后自动查询标签"
        style="width: 300px"
      />
      <!--代理-->
      <div class="agent-box">
        <div style="display: flex; flex-direction: row; gap: 5px">
          <div>网络代理</div>
          <n-switch v-model:value="agent" />
        </div>
        <div class="agent-in">
          端口:
          <div style="max-width: 70px">{{ generalStore.port }}</div>
        </div>
      </div>
    </div>
    <!--标签盒子-->
    <div class="tabs-back-box">
      <div
        v-for="(item, index) in options"
        :key="index"
        class="tabs-box cursorPointer"
        :class="{ active: activeTabIds?.has(item.value) }"
        @click="handleTabClick(item)"
      >
        {{ item.label }}
      </div>
    </div>
    <div class="search-back-tab">
      <!-- 添加清空按钮 -->
      <div class="controls">
        <n-button size="small" @click="clearAllTabs">清空已选</n-button>
        <span>已选标签: {{ searchTabs?.length }} 个</span>
      </div>
      <!--已选择标签-->
      <div class="search-back-tab-list">
        <div
          v-for="(item, index) in searchTabs"
          :key="'selected-' + index"
          class="tabs-box active cursorPointer"
          @click="handleSearchTabClick(item, index)"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <n-button style="margin-top: 10px" @click="ru34Func">请求RU34列表</n-button>
  </div>
</template>

<style scoped>
.search-box {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
.tabs-back-box {
  box-sizing: border-box;
  padding: 10px 0 10px 0;
  width: 70%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 10px;
}
.search-back-tab {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  gap: 10px;
  overflow: auto;
  width: 80%;
  justify-content: center;
  .search-back-tab-list {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
    overflow: auto;
    flex-wrap: wrap;
    max-height: 80px;
    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
  }
  .controls {
    display: flex;
    flex-direction: row;
    gap: 10px;
    align-items: center;
  }
}
.tabs-box {
  box-sizing: border-box;
  padding: 3px 5px;
  display: flex;
  flex-direction: row;
  background-color: var(--button-hover-color);
  border-radius: 5px;
  &.active {
    background-color: var(--tab-active-color);
  }
  &:not(.active):hover {
    background-color: var(--tab-not-active-color);
  }
}
.agent-box {
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 10px;
  left: 10px;
  gap: 5px;
  .agent-in {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
.search-all {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
