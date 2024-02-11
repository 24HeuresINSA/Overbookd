<template>
  <div class="volunteer-request">
    <v-tooltip top color="error" :disabled="!isAlsoRequested">
      <template #activator="{ on, attrs }">
        <NuxtLink :to="`/planning/${volunteer.id}`">
          <v-chip
            :class="volunteerStatus"
            v-bind="attrs"
            close
            v-on="on"
            @click:close="removeVolunteer"
          >
            {{ formatUserNameWithNickname(volunteer) }}
          </v-chip>
        </NuxtLink>
      </template>
      <v-list-item v-for="(message, i) in alsoRequestedByErrors" :key="i" dark>
        <v-list-item-content>
          <v-list-item-title> {{ message }} </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { VolunteerWithConflicts } from "@overbookd/festival-event";
import { formatUserNameWithNickname } from "~/utils/user/user.utils";

export default defineComponent({
  name: "VolunteerWithConflictsChip",
  props: {
    volunteer: {
      type: Object as () => VolunteerWithConflicts,
      required: true,
    },
  },
  emits: ["remove"],
  computed: {
    isAlsoRequested(): boolean {
      return this.volunteer.conflicts.tasks.length > 0;
    },
    volunteerStatus(): string {
      if (this.isAlsoRequested) return "also-requested-by-ft";
      return "";
    },
    alsoRequestedByErrors(): string[] {
      return this.volunteer.conflicts.tasks.map(
        ({ id, name }) => `Aussi demandé dans la FT #${id} - ${name}`,
      );
    },
  },
  methods: {
    formatUserNameWithNickname,
    removeVolunteer() {
      this.$emit("remove", this.volunteer);
    },
  },
});
</script>
