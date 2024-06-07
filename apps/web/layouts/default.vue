<template>
  <div class="layout">
    <Header />
    <div class="content">
      <slot />
    </div>
    <Footer />
  </div>
</template>

<script lang="ts" setup>
import Header from "~/layouts/parts/header.vue";
import Footer from "~/layouts/parts/footer.vue";
</script>

<style lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
}
</style>
