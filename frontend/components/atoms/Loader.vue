<template>
  <div v-show="loading" class="loader">
    <h1>Waiting for response</h1>
    <div class="spinner"><span></span></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "Loader",
  props: {
    loading: {
      type: Boolean,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.loader {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  opacity: 85%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 30px;
}

.spinner {
  height: 32px;
  width: 32px;
  animation: spinner-1-1 4.8s linear infinite;
  span {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    height: 32px;
    width: 32px;
    clip: rect(0, 32px, 32px, 16px);
    animation: spinner-1-2 1.2s linear infinite;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      height: 32px;
      width: 32px;
      clip: rect(0, 32px, 32px, 16px);
      border: 3px solid gray;
      border-radius: 50%;
      animation: spinner-1-3 1.2s cubic-bezier(0.77, 0, 0.175, 1) infinite;
    }
  }
}
@keyframes spinner-1-1 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes spinner-1-2 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(220deg);
  }
}

@keyframes spinner-1-3 {
  0% {
    transform: rotate(-140deg);
  }
  50% {
    transform: rotate(-160deg);
  }
  100% {
    transform: rotate(140deg);
  }
}
</style>
