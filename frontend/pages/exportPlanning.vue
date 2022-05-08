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
        <v-btn
          color="secondary"
          class="btn"
          :disabled="uniquePlanning === undefined"
          @click="exportPlanning('unique')"
        >
          Télécharger <v-icon right dark> mdi-download </v-icon></v-btn
        >
      </div>
    </div>
    <div class="multiple">
      <h2>Exporter tous les plannings</h2>
      <p>Vous pouvez exporter les plannings de TOUS les orgas.</p>
      <p class="warn">
        Attention : Ce que vous vous apprétez à faire est gourmand en temps et
        en puissance de calcul donc soyez bien sûr que c'est le bon moment.
      </p>
      <div class="buttons">
        <v-btn color="red" class="btn" @click="confirmation = true">
          Générer<v-icon right dark> mdi-cog </v-icon></v-btn
        >
        <v-btn
          color="secondary"
          class="btn"
          :disabled="multiplePlanning === undefined"
          @click="exportPlanning('multiple')"
        >
          Télécharger <v-icon right dark> mdi-download </v-icon></v-btn
        >
      </div>
    </div>
    <v-snackbar v-model="snack.active" :timeout="snack.timeout">
      <h3>{{ snack.feedbackMessage }}</h3>
    </v-snackbar>
    <Loader :loading="isLoading"></Loader>
    <v-dialog v-model="confirmation" max-width="800">
      <v-card>
        <v-card-title>Confirmation</v-card-title>
        <v-card-text>T'es vraiment sûr de ce que tu veux faire ?</v-card-text>
        <div style="display: flex; justify-content: center; padding: 1%">
          <v-btn color="red" style="margin: 2%" @click="generateAllPlanning">
            OUI</v-btn
          >
          <v-btn color="green" style="margin: 2%" @click="confirmation = false">
            NON</v-btn
          >
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import planningRepo from "~/repositories/planningRepo";
import Loader from "~/components/atoms/Loader.vue";
import { Snack } from "~/utils/models/snack";

export default {
  components: {
    Loader,
  },
  data() {
    return {
      selected_user: undefined,
      uniquePlanning: undefined,
      multiplePlanning: undefined,
      isLoading: false,
      snack: new Snack(),
      confirmation: false,
    };
  },
  methods: {
    updateUser(value) {
      this.selected_user = value.value;
    },
    async generatePlanning() {
      this.isLoading = true;
      this.uniquePlanning = undefined;
      this.multiplePlanning = undefined;
      await planningRepo
        .createPlanning(this, this.selected_user._id)
        .then((res) => {
          if (res) {
            this.uniquePlanning = res.data;
          } else {
            this.snack.display("Une erreur est survenue");
          }
          this.isLoading = false;
        })
        .catch(() => {
          this.snack.display("Une erreur est survenue");
          this.isLoading = false;
        });
    },
    async generateAllPlanning() {
      this.confirmation = false;
      this.isLoading = true;
      this.uniquePlanning = undefined;
      this.multiplePlanning = undefined;
      await planningRepo
        .createAllPlanning(this)
        .then((res) => {
          if (res) {
            this.multiplePlanning = res.data;
          } else {
            this.snack.display("Une erreur est survenue");
          }
          this.isLoading = false;
        })
        .catch(() => {
          this.snack.display("Une erreur est survenue");
          this.isLoading = false;
        });
    },
    exportPlanning(mode) {
      const pdf =
        mode === "unique" ? this.uniquePlanning : this.multiplePlanning;
      window.open(pdf);
    },
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

  .buttons {
    display: flex;

    .btn {
      margin-right: 1vw;
    }
  }
}
</style>
