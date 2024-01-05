<template>
  <v-card>
    <v-btn v-if="closable" class="close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card-title>
      <h2>Proposer un repas</h2>
    </v-card-title>
    <v-card-text>
      <form>
        <div class="when">
          <DateField v-model="day" hide-details class="day" />
          <v-select
            v-model="moment"
            :items="moments"
            class="moment"
            solo
            hide-details
          ></v-select>
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
import { Moment, MIDI, SOIR, MealDate } from "@overbookd/personal-account";
import { MyUserInformation } from "@overbookd/user";

type OfferSharedMealFormData = {
  moment: Moment;
  day: Date;
  menu: string;
};

export default defineComponent({
  name: "OfferSharedMealForm",
  components: { DateField },
  props: {
    closable: {
      type: Boolean,
      default: () => false,
    },
  },
  emits: ["close-dialog"],
  data: (): OfferSharedMealFormData => ({
    moment: MIDI,
    day: new Date(),
    menu: "",
  }),
  computed: {
    moments(): Moment[] {
      return [MIDI, SOIR];
    },
    date(): MealDate {
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
      });
      this.menu = "";
      this.day = new Date();
      this.moment = MIDI;
      if (this.closable) this.closeDialog();
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
  align-items: flex-end;
  font-size: large;
  gap: 5px;
  margin-bottom: 15px;

  @media only screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    align-self: flex-start;
    gap: 10px;
    .day,
    .moment {
      min-width: 100%;
    }
  }
}

.offer {
  width: 100%;
}
</style>
