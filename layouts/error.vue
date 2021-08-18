<template>
  <v-app dark>
    <v-container v-if="error.statusCode === 404">
      <v-img src="https://media.giphy.com/media/1EmBoG0IL50VIJLWTs/giphy.gif"></v-img>
      <h1>T'es perdu ?</h1>
    </v-container>

    <template v-else>
      <v-img src="https://media.giphy.com/media/hrRJ41JB2zlgZiYcCw/giphy.gif"></v-img>
      <h1>La ComSI be like</h1>
    </template>
    <NuxtLink to="/login"> Revnier au login </NuxtLink>
  </v-app>
</template>

<script>
export default {
  layout: 'none',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred',
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
