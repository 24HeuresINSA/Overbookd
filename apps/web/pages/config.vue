<template>
  <v-container>
    <h1>Config admin ⚙️</h1>

    <v-img
      height="500"
      src="https://media.giphy.com/media/P07JtCEMQF9N6/giphy.gif"
    ></v-img>

    <div class="field-row">
      <DateField v-model="dateEventStart" label="Début de la manif"></DateField>
      <v-btn class="field-row__save-btn" @click="saveDateEventStart">
        Enregistrer
      </v-btn>
    </div>

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

  async created() {
    await this.$accessor.configuration.fetchAll();
    const startString = this.$accessor.configuration.get("eventDate")?.start;
    if (startString) this.dateEventStart = new Date(startString);
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

<style lang="scss" scoped>
.field-row {
  padding-top: 20px;
  display: flex;
  gap: 20px;
  justify-content: space-between;

  &__save-btn {
    margin-top: 12px;
  }
}
</style>
