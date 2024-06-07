<template>
  <NuxtLayout>
    <div class="container">
      <div v-if="error?.statusCode === pageNotFoundErrorCode" class="content">
        <v-img
          class="lost-gif"
          src="https://media.giphy.com/media/1EmBoG0IL50VIJLWTs/giphy.gif"
        />
        <h1>T'es perdu ?</h1>
      </div>

      <div v-else class="content">
        <v-img
          class="error-gif"
          src="https://media1.giphy.com/media/EtB1yylKGGAUg/giphy.gif?cid=ecf05e47qaynhsxphvtrr3q7u3bskmwj15onszejof9z483h&rid=giphy.gif&ct=g"
        />
        <h1>La ComSI be like</h1>
      </div>
      <p class="error-message">{{ error?.message }}</p>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const error = useError();

const pageNotFoundErrorCode = 404;
const pageNotFound = "404 Not Found";
const otherError = "An error occurred";

useHead(() => {
  const title =
    error.value?.statusCode === pageNotFoundErrorCode
      ? pageNotFound
      : otherError;
  return { title };
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  margin-top: 20px;
}

.error-message {
  font-size: 18px;
  color: #666;
}

.lost-gif,
.error-gif {
  width: 480px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
