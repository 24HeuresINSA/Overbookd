<template>
  <div>
    <v-card v-if="FT">
      <v-card-title>Info</v-card-title>
      <v-card-text>
        <v-autocomplete
          v-if="locations"
          label="Lieux"
          multiple
          :items="locations"
          :value="mLocations"
          item-text="name"
          :disabled="isDisabled"
          @change="selectLocations"
        ></v-autocomplete>
        <v-simple-table>
          <template #default>
            <thead>
              <tr>
                <th>Name</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>FA</td>
                <td>
                  <a v-if="FT.FA && FT.FA > 0">{{ FT.FA }}</a>
                  <v-btn :href="`/fa/${FT.FA}`" icon small>
                    <v-icon small>mdi-link</v-icon>
                  </v-btn>
                  <v-btn small text @click="openFAChooser"
                    >Choisir une FA parente</v-btn
                  >
                  <v-btn small text @click="unlinkFA">Détacher la FA</v-btn>
                </td>
              </tr>
              <tr>
                <td>Nombre de matos</td>
                <td>{{ FT.equipments.length }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
    <FAChooser ref="FAChooser"></FAChooser>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import FAChooser from "~/components/organisms/FAChooser.vue";

export default Vue.extend({
  name: "FTInfoCard",
  components: {
    FAChooser,
  },
  data() {
    return {
      isDisabled: false, // TODO :: should be a props
    };
  },
  // props: {
  //   isDisabled: {
  //     type: Boolean,
  //     default: false,
  //   },
  // },
  computed: {
    FT() {
      return this.$accessor.FT.mFT;
    },
    locations(): string[] {
      return this.$accessor.location.signa.map((l) => l.name);
    },
    mLocations(): string[] | null {
      if (
        this.$accessor.FT.mFT.details &&
        this.$accessor.FT.mFT.details.locations
      ) {
        return this.$accessor.FT.mFT.details.locations;
      }
      return null;
    },
  },
  async mounted() {
    await this.$accessor.location.getAllLocations();
  },
  methods: {
    selectLocations(locations: string[]): void {
      this.$accessor.FT.assignFT({
        details: {
          locations,
        },
      });
    },
    unlinkFA(): void {
      this.$accessor.FT.unlinkFA();
    },
    openFAChooser(): void {
      (this.$refs.FAChooser as any).openDialog();
    },
  },
});
</script>

<style scoped></style>
