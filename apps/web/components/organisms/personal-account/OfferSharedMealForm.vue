<template>
  <v-card>
    <v-btn class="close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card-title>
      <h2>Proposer un <wbr /> repas <wbr /> partage</h2>
    </v-card-title>
    <v-card-text>
      <form>
        <div class="when">
          Le <DateField v-model="day" />
          <v-select v-model="moment" :items="moments" outlined></v-select>
        </div>
        <div class="menu">
          <h3><v-icon>mdi-silverware</v-icon> Au menu</h3>
          <v-textarea v-model="menu" outlined label="Menu"></v-textarea>
        </div>
        <v-btn class="offer" color="primary" dark large @click="offer">
          C'est pret <v-icon right>mdi-silverware-fork-knife</v-icon>
        </v-btn>
      </form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DateField from "~/components/atoms/field/date/DateField.vue";
import {
  Moment,
  MIDI,
  SOIR,
  IDefineMealDate,
} from "@overbookd/personal-account";
import { MyUserInformation } from "@overbookd/user";

type OfferSharedMealFormData = {
  moment: Moment;
  day: Date;
  menu: string;
};

export default defineComponent({
  name: "OfferSharedMealForm",
  components: { DateField },
  data: (): OfferSharedMealFormData => ({
    moment: "MIDI",
    day: new Date(),
    menu: "",
  }),
  computed: {
    moments(): Moment[] {
      return [MIDI, SOIR];
    },
    date(): IDefineMealDate {
      return {
        moment: this.moment,
        day: new Date(this.day.toString()),
      };
    },
    me(): MyUserInformation {
      return this.$accessor.user.me;
    },
  },
  methods: {
    closeDialog() {
      this.$emit("close-dialog");
    },
    async offer() {
      await this.$accessor.mealSharing.offerSharedMeal({
        menu: this.menu,
        date: this.date,
        chefId: this.me.id,
      });
      this.$router.push({
        path: `/meal-sharing/${this.$accessor.mealSharing.sharedMeal?.id}`,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
h2 {
  text-wrap: nowrap;
}
.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.when {
  display: flex;
  align-items: baseline;
  font-size: large;
  gap: 5px;
}

.offer {
  width: 100%;
}
</style>
