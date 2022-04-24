<template>
  <div>
    <div class="front">
      <div class="left">
        <h1>Export de planning</h1>
        <p class="sorry">Désolé pour cette nouvelle page les humains...</p>
      </div>
      <div class="right">
        <h1>Ce qu'on fait ici</h1>
        <p>
          Export des plannings soit pour tous les orgas soit pour un orga
          spécifique
        </p>
      </div>
    </div>
    <div class="unique">
      <h2>Exporter un planning unique</h2>
      <p>
        Veuillez séléctionner l'orga dont vous souhaitez exporter le planning
      </p>
      <OverField
        class="selector"
        :field="{
          key: 'validated_user',
          label: 'orga',
          type: 'validated_user',
        }"
        @value="updateUser"
      ></OverField>
      <div class="buttons">
        <v-btn
          color="success"
          class="btn"
          :disabled="selected_user === undefined"
          @click="generatePlanning"
        >
          Générer<v-icon right dark> mdi-cog </v-icon></v-btn
        >
        <v-btn color="secondary" class="btn" :disabled="!planningLoaded"
          >Télécharger <v-icon right dark> mdi-download </v-icon></v-btn
        >
        <v-btn color="primary" class="btn" :disabled="!planningLoaded"
          >Envoyer <v-icon right dark> mdi-email-fast </v-icon></v-btn
        >
      </div>
    </div>
    <div class="multiple">
      <h2>Exporter tous les plannings</h2>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selected_user: undefined,
      planningLoaded: false,
    };
  },
  methods: {
    updateUser(value) {
      this.selected_user = value.value;
    },
    generatePlanning() {},
  },
};
</script>

<style lang="scss" scoped>
.front {
  display: flex;
  justify-content: space-between;
  .right {
    text-align: right;
  }
  .sorry {
    font-style: italic;
  }
}
.unique {
  padding: 1%;
  border: 1px solid #ccc;
  .selector {
    width: 25%;
  }
  .buttons {
    display: flex;

    .btn {
      margin-right: 1vw;
    }
  }
}
.multiple {
  padding: 1%;
  border: 1px solid #ccc;
}
</style>
