<template>
  <v-container>
    <h1>Configuration du système ⚙️</h1>

    <v-img
      height="500"
      src="https://media.giphy.com/media/P07JtCEMQF9N6/giphy.gif"
    ></v-img>

    <h2>Formulaire d'inscription</h2>
    <v-select
      v-model="registerFormState"
      :items="registerFormStates"
    ></v-select>

    <h2>Date de début de la manif</h2>
    <DateField v-model="dateEventStart" label="Début de la manif"></DateField>
    <v-btn class="save-btn" @click="saveDateEventStart"> Enregistrer </v-btn>

    <PermissionsCard />
    <SnackNotificationContainer />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import PermissionsCard from "~/components/organisms/permission/PermissionsCard.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import DateField from "~/components/atoms/field/date/DateField.vue";
import {
  RegisterFormState,
  registerFormStates,
} from "@overbookd/configuration";
import { isSameDay } from "~/utils/date/dateUtils";

interface ConfigurationData {
  dateEventStart: Date;
  registerFormState: RegisterFormState;
}

export default Vue.extend({
  name: "Config",
  components: {
    PermissionsCard,
    SnackNotificationContainer,
    DateField,
  },

  data(): ConfigurationData {
    return {
      dateEventStart: new Date(),
      registerFormState: registerFormStates.CLOSED,
    };
  },

  head: () => ({
    title: "Config Système",
  }),

  computed: {
    registerFormStates() {
      return Object.values(registerFormStates);
    },
  },

  async created() {
    await this.$accessor.configuration.fetchAll();
    this.dateEventStart = this.$accessor.configuration.eventStartDate;
    this.registerFormState = this.$accessor.configuration.registerFormState;
  },

  methods: {
    async saveDateEventStart() {
      if (
        !isSameDay(
          this.dateEventStart,
          this.$accessor.configuration.eventStartDate
        )
      ) {
        await this.$accessor.configuration.save({
          key: "eventDate",
          value: { start: this.dateEventStart },
        });
      }

      if (
        this.registerFormState !==
        this.$accessor.configuration.registerFormState
      ) {
        await this.$accessor.configuration.save({
          key: "registerForm",
          value: { state: this.registerFormState },
        });
      }
    },
  },
});
</script>

<style lang="scss" scoped>
h2 {
  margin-top: 20px;
}

.save-btn {
  margin-top: 12px;
}
</style>
