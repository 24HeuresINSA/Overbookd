<template>
  <v-card :color="me.availabilities.length === 0 ? 'red' : ''">
    <v-card-title
      >Mes dispos : <v-spacer /><v-btn color="#5fdb48" :to="availabilitiesPath"
        >Renseigner plus de créneaux</v-btn
      >
    </v-card-title>
    <AvailabilitiesCalendar :m-user="me" class="myCal" />
  </v-card>
</template>

<script>
import AvailabilitiesCalendar from "~/components/molecules/timeframe/AvailabilitiesCalendar.vue";

export default {
  name: "AvailabilitiesSummaryCard",
  components: {
    AvailabilitiesCalendar,
  },
  data() {
    return {
      availabilitiesPath: "/availabilities",
    };
  },
  computed: {
    me() {
      return this.$accessor.user.me;
    },
  },
};
</script>

<style>
.myCal {
  height: 50vh;
}
</style>
