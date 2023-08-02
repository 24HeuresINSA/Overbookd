<template>
  <v-container>
    <h1>Configuration du système ⚙️</h1>

    <v-img
      height="500"
      src="https://media.giphy.com/media/P07JtCEMQF9N6/giphy.gif"
    ></v-img>

    <h2>Description du formulaire d'inscription</h2>
    <RichEditor
      :data="registerFormDescription"
      class="mb-4"
      @change="updateRegisterFormDescription($event)"
    ></RichEditor>

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
import RichEditor from "~/components/atoms/field/tiptap/RichEditor.vue";
import { isSameDay } from "~/utils/date/dateUtils";

interface ConfigurationData {
  dateEventStart: Date;
  registerFormDescription: string;
}

export default Vue.extend({
  name: "Config",
  components: {
    PermissionsCard,
    SnackNotificationContainer,
    DateField,
    RichEditor,
  },

  data(): ConfigurationData {
    return {
      dateEventStart: new Date(),
      registerFormDescription: "",
    };
  },

  head: () => ({
    title: "Config Système",
  }),

  async created() {
    await this.$accessor.configuration.fetchAll();
    this.dateEventStart = this.$accessor.configuration.eventStartDate;
    this.registerFormDescription =
      this.$accessor.configuration.registerFormDescription;
  },

  methods: {
    updateRegisterFormDescription(description: string) {
      this.registerFormDescription = description;
    },
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
        this.registerFormDescription !==
        this.$accessor.configuration.registerFormDescription
      ) {
        await this.$accessor.configuration.save({
          key: "registerForm",
          value: { description: this.registerFormDescription },
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
