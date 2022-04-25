<template>
  <div>
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
      <p>Vous pouvez exporter les plannings de TOUS les orgas.</p>
      <p class="warn">
        Attention : vous n'aurez pas de prévisualisations et près de 300 mails
        vont partir donc soyez bien sûr de ce que vous faites.
      </p>
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
.unique {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1%;
  border: 1px solid #ccc;
  margin-bottom: 1%;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .warn {
    color: red;
  }
}
</style>
