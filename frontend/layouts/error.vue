<template>
  <v-app dark>
    <div class="container">
      <v-container v-if="error.statusCode === 404">
        <v-img
          class="lost-gif"
          src="https://media.giphy.com/media/1EmBoG0IL50VIJLWTs/giphy.gif"
        ></v-img>
        <h1>T'es perdu ?</h1>
      </v-container>

      <template v-else>
        <v-img
          class="error-gif"
          src="https://media1.giphy.com/media/EtB1yylKGGAUg/giphy.gif?cid=ecf05e47qaynhsxphvtrr3q7u3bskmwj15onszejof9z483h&rid=giphy.gif&ct=g"
        ></v-img>
        <h1>La ComSI be like</h1>
      </template>
      <NuxtLink to="/login"> Revenir au login </NuxtLink>
    </div>
  </v-app>
</template>

<script>
export default {
  layout: "none",
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: "404 Not Found",
      otherError: "An error occurred",
    };
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title,
    };
  },
};
</script>

<style scoped>
h1 {
  font-size: 20px;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.lost-gif,
.quatre-gif {
  width: 35%;
  height: 25%;
}
</style>
