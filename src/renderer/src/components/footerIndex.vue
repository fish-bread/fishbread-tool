<script setup lang="ts">
import MoeCounter from './moeCounter.vue'
</script>
<template>
  <div class="footer-page">
    <moe-counter />
    <div class="footer-box">
      <div>© Renovamen 2025</div>
      <div>Powered by fishbread-tool & fishbread</div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.footer-page {
  box-sizing: border-box;
  width: 100%;
  height: 200px;
  padding: 24px 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
}
.footer-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
