<template>
  <NuxtLayout>
    <div class="error">
      <v-img class="error__gif" :src="error.gif" :alt="error.alt" />
      <h1>{{ error.comment }}</h1>
      <p class="error__message">{{ error.message }}</p>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const nuxtError = useError();

const pageNotFoundErrorCode = 404;
const pageNotFound = "404 Not Found";
const otherError = "An error occurred";

const isPageNotFoundError = computed<boolean>(
  () => nuxtError.value?.statusCode === pageNotFoundErrorCode,
);

type PageError = {
  title: string;
  gif: string;
  alt: string;
  message: string;
  comment: string;
};

const lostGif = "https://media.giphy.com/media/1EmBoG0IL50VIJLWTs/giphy.gif";
const angryPandaGif =
  "https://media1.giphy.com/media/EtB1yylKGGAUg/giphy.gif?cid=ecf05e47qaynhsxphvtrr3q7u3bskmwj15onszejof9z483h&rid=giphy.gif&ct=g";

const lost = {
  title: pageNotFound,
  gif: lostGif,
  alt: "POV : Tu t'es perdu sur OverBookd",
  comment: "T'es perdu ?",
};
const other = {
  title: otherError,
  gif: angryPandaGif,
  alt: "Un panda qui ravage un bureau",
  comment: "La ComSa be like",
};

const context = isPageNotFoundError.value ? lost : other;
const message = nuxtError.value?.message || "";
const error: PageError = { ...context, message };

const pageTitle = isPageNotFoundError.value ? "404 Not Found" : "Overbookd";
useHead({ title: pageTitle });
</script>

<style lang="scss" scoped>
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;

  h1 {
    font-size: 24px;
    font-weight: bold;
    margin: 20px 0;
  }

  &__message {
    font-size: 18px;
    color: #666;
  }

  &__gif {
    width: 480px;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}
</style>
