<script setup lang="ts">
import WindowsControl from '@renderer/components/windowsControl.vue'
import WeatherSunny20Regular from '@vicons/fluent/WeatherSunny20Regular'
import WeatherMoon20Regular from '@vicons/fluent/WeatherMoon20Regular'
import Github from '@vicons/fa/Github'
import AppIcon from '@renderer/assets/header/1.png'
import { theme, whiteTheme } from '@renderer/func/themeChange'
import { routerOpen } from '@renderer/router/routerFunc'
</script>

<template>
  <div
    class="header"
    :style="{
      backgroundColor: theme === null ? '#ffffff' : '#2c2c2c',
      boxShadow:
        theme === null ? '0 0 1px 1px rgba(0, 0, 0, 0.3)' : '0 0 1px 1px rgba(50, 50, 50, 0.3)'
    }"
  >
    <!--左-->
    <div class="head-left app-drag">
      <!--头像-->
      <n-avatar draggable="false" round :src="AppIcon" size="large" />
      <!--logo-->
      <div class="logo-title">FISHBREAD</div>
    </div>
    <!--右-->
    <div class="head-right">
      <!--链接按钮-->
      <div class="link-button">
        <!--github-->
        <div style="display: flex; align-items: center">
          <n-tooltip :show-arrow="false" trigger="hover">
            <template #trigger>
              <n-icon size="20" class="cursorPointer">
                <Github @click="routerOpen('https://github.com/fish-bread/electron-python')" />
              </n-icon>
            </template>
            github
          </n-tooltip>
        </div>
        <!--主题-->
        <div style="display: flex; align-items: center">
          <!--白天-->
          <div
            v-show="theme === null"
            style="display: flex; align-items: center"
            @click="whiteTheme(true)"
          >
            <n-tooltip :show-arrow="false" trigger="hover">
              <template #trigger>
                <n-icon size="40" class="cursorPointer">
                  <WeatherSunny20Regular />
                </n-icon>
              </template>
              日间模式
            </n-tooltip>
          </div>
          <!--夜晚-->
          <div
            v-show="theme !== null"
            style="display: flex; align-items: center"
            @click="whiteTheme(false)"
          >
            <n-tooltip :show-arrow="false" trigger="hover">
              <template #trigger>
                <n-icon size="40" class="cursorPointer">
                  <WeatherMoon20Regular />
                </n-icon>
              </template>
              夜晚模式
            </n-tooltip>
          </div>
        </div>
      </div>
      <!--控制栏-->
      <WindowsControl />
    </div>
  </div>
</template>

<style scoped lang="scss">
%head-box-display-row {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
}
.header {
  box-sizing: border-box;
  height: 50px;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  transition: all 0.2s ease;
  .head-left {
    @extend %head-box-display-row;
    gap: 5px;
    align-items: center;
    flex: 1;
    .logo-title {
      user-select: none;
      font-size: 30px;
      font-weight: bold;
    }
  }
  .head-right {
    @extend %head-box-display-row;
    gap: 10px;
    align-items: center;
    .link-button {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }
}
</style>
