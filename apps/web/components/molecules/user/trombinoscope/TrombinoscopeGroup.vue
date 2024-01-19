<template>
  <div class="group">
    <h2>{{ heading }}</h2>
    <div class="volunteers">
      <div v-for="volunteer in volunteers" :key="volunteer.id">
        <v-sheet min-height="250" class="contain-card">
          <v-lazy class="contain-card">
            <TrombinoscopeCard
              :volunteer="volunteer"
              class="trombinoscopeCard"
            />
          </v-lazy>
        </v-sheet>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { UserPersonalData } from "@overbookd/user";
import { UserPersonalDataWithProfilePicture } from "~/utils/models/user.model";
import TrombinoscopeCard from "./TrombinoscopeCard.vue";

type Volunteer = UserPersonalData | UserPersonalDataWithProfilePicture;

export default defineComponent({
  name: "TrombinoscopeGroup",
  components: { TrombinoscopeCard },
  props: {
    volunteers: {
      required: true,
      type: Array as () => Volunteer[],
    },
    heading: {
      required: true,
      type: String,
    },
  },
});
</script>

<style lang="scss" scoped>
.volunteers {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 350px));
  gap: 15px;
  align-items: stretch;
  justify-content: center;
  .contain-card {
    height: 100%;
    .trombinoscopeCard {
      height: 100%;
    }
  }
}
</style>
