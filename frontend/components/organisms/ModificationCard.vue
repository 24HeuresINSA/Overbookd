<template>
  <v-card>
    <v-card-title>{{ user.firstname + " " + user.lastname }}</v-card-title>
    <v-card-text>Dispos actuels : </v-card-text>
    <v-row>
      <v-col v-for="title in existingGroupTitles" :key="title" md="12">
        <TimeslotEditor :group-title="title" :user="user"></TimeslotEditor>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import TimeslotEditor from "~/components/organisms/TimeslotEditor";

export default {
  components: {
    TimeslotEditor,
  },
  props: {
    user: {
      type: Object,
      default: () => undefined,
    },
  },
  computed: {
    existingGroupTitles: function () {
      return this.$accessor.timeslot.timeslots.reduce((acc, cur) => {
        if (!acc.includes(cur.groupTitle)) {
          acc.push(cur.groupTitle);
        }
        return acc;
      }, []);
    },
  },
  timeslots: function () {
    return this.$accessor.timeslot.timeslots;
  },
};
</script>

<style></style>
