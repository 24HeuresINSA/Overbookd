<template>
  <div v-show="volunteers.length > 0" class="group">
    <h2 class="heading">{{ heading }}</h2>
    <div class="volunteers">
      <div v-for="volunteer in volunteers" :key="volunteer.id">
        <v-sheet min-height="250" class="contain-card">
          <v-lazy class="contain-card">
            <TrombinoscopeCard
              :volunteer="volunteer"
              class="trombinoscope-card"
              @click:team="propagateClickedTeam"
              @click:volunteer="propagateClickedVolunteer"
            />
          </v-lazy>
        </v-sheet>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Team } from "@overbookd/team";
import type { UserPersonalData } from "@overbookd/user";

defineProps({
  volunteers: {
    required: true,
    type: Array as PropType<UserPersonalData[]>,
  },
  heading: {
    required: true,
    type: String,
  },
});

const emit = defineEmits(["click:team", "click:volunteer"]);
const propagateClickedTeam = (team: Team) => emit("click:team", team);
const propagateClickedVolunteer = (volunteer: UserPersonalData) =>
  emit("click:volunteer", volunteer);
</script>

<style lang="scss" scoped>
.heading {
  text-align: center;
  margin: 20px 0;
}

.volunteers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 320px));
  gap: 15px;
  align-items: stretch;
  justify-content: center;
  .contain-card {
    height: 100%;
    background: rgb(var(--v-theme-background));
    .trombinoscope-card {
      height: 100%;
    }
  }
}
</style>
