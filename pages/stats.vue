<template>
  <v-container>
    <h1>Stats 📈</h1>
    <p>
      En gros la plus part des stats qu'on calcule avec un millard de stats
      seront calcule par overbookd et affiche ici
    </p>
    <p>
      C'est tres important pour leur faire comprendre a quel point ils seront en
      retard
    </p>
    <h2>A quel point on est en retard...</h2>
    <v-img src="img/stats.png"></v-img>
    <v-img src="img/memes/human_meme.png"></v-img>
  </v-container>
</template>

<script>
import { hasRole } from "../common/role";

export default {
  name: "Stats",

  mounted() {
    if (!hasRole(this, "hard")) {
      this.$router.push({
        path: "/",
      });
    }
  },
};
</script>

<style scoped></style>
