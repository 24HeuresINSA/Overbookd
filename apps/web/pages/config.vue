<template>
  <v-container>
    <h1>Config admin ⚙️</h1>

    <v-img
      height="500"
      src="https://media.giphy.com/media/P07JtCEMQF9N6/giphy.gif"
    ></v-img>

    <DateField v-model="dateEventStart" label="Début de la manif"></DateField>
    <v-btn @click="saveDateEventStart"> Enregistrer </v-btn>

    <PermissionsCard />
    <SnackNotificationContainer />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import PermissionsCard from "~/components/organisms/permission/PermissionsCard.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import DateField from "~/components/atoms/field/date/DateField.vue";

interface ConfigurationData {
  dateEventStart?: Date;
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
      dateEventStart: undefined,
    };
  },

  head: () => ({
    title: "Admin",
  }),

  created() {
    this.dateEventStart = this.$accessor.configuration.get("eventDate").start;
  },

  methods: {
    async saveDateEventStart() {
      await this.$accessor.configuration.save({
        key: "eventDate",
        value: { start: this.dateEventStart },
      });
    },
  },
});
</script>
