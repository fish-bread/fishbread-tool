<script setup lang="ts">
const quit = (): void => {
  window.api.quitApplyFunc()
}
</script>

<template>
  <div class="menu-back">
    <div class="menu-button cursorPointer">你好</div>
    <hr class="custom-hr" />
    <div class="menu-button cursorPointer" @click="quit">退出</div>
  </div>
</template>

<style scoped lang="scss">
.menu-back {
  box-sizing: border-box;
  background-color: #ffffff !important;
  color: #2c2c2c !important;
  padding: 5px 5px;
  width: 100vw;
  height: 100vh;
}
.menu-button {
  box-sizing: border-box;
  border-radius: 3px;
  padding: 2px 2px;
  transition: background-color 0.2s;
  &:hover {
    background-color: #d8ccee;
  }
}
.custom-hr {
  box-sizing: border-box;
  background-color: #e7e7e7;
  margin: 2px 0;
}
</style>
