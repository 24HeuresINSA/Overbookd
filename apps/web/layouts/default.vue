<template>
  <div class="layout">
    <Header />
    <div class="side-with-main">
      <SideNav />
      <div class="main">
        <div class="content">
          <slot />
        </div>
        <Footer />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Header from "~/layouts/parts/header.vue";
import SideNav from "~/layouts/parts/side-nav.vue";
import Footer from "~/layouts/parts/footer.vue";
</script>

<style lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.side-with-main {
  flex: 1;
  display: flex;
  @media only screen and (max-width: $mobile-max-width) {
    flex-direction: column;
  }
  min-height: calc(100% - #{$header-height});
  .main {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    margin-left: 35px;
    width: 100%;
    @media only screen and (max-width: $mobile-max-width) {
      padding-bottom: 60px;
      margin: unset;
    }
    .content {
      padding: 10px;
      @media only screen and (max-width: $mobile-max-width) {
        padding: 0 5px 5px 5px;
      }
    }
  }
}
</style>
