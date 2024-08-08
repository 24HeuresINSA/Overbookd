<template>
  <div class="group">
    <h2 class="heading">{{ heading }}</h2>
    <div class="volunteers">
      <div v-for="volunteer in volunteers" :key="volunteer.id">
        <v-sheet min-height="250" class="contain-card">
          <v-lazy class="contain-card">
            <TrombinoscopeCard
              :volunteer="volunteer"
              class="trombinoscope-card"
            />
          </v-lazy>
        </v-sheet>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { UserDataWithPotentialyProfilePicture } from "~/utils/user/user-information";

const { volunteers, heading } = defineProps({
  volunteers: {
    required: true,
    type: Array as PropType<UserDataWithPotentialyProfilePicture[]>,
  },
  heading: {
    required: true,
    type: String,
  },
});
</script>

<style lang="scss" scoped>
.heading {
  text-align: center;
  margin: 20px 0;
}

.volunteers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 350px));
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
