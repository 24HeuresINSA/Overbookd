<template>
  <h1>{{faID}}</h1>

</template>

<script>
export default {
  name: "_faID",
  data() {
    return {
      faID : this.$route.params.faID,
      isNewFA: this.$route.params.faID === 'newFA',
    }
  },
  mounted() {
  }
}
</script>

<style scoped>

</style>