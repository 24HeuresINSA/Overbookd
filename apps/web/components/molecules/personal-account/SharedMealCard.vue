<template>
  <div>
    <v-card class="shared-meal">
      <v-card-title class="meal-title">
        {{ shared.meal.date }}
      </v-card-title>
      <v-card-text class="presentation">
        <div class="chief">
          <v-icon>mdi-chef-hat</v-icon>
          <span>{{ shared.chef.name }}</span>
        </div>

        <div class="menu">
          <v-textarea
            outlined
            label="Au menu 🍴"
            :value="shared.meal.menu"
            readonly
            hide-details
            :rows="4"
          ></v-textarea>
        </div>

        <div class="shotgun">
          <span>
            {{ shared.shotgunCount }} {{ guests }}
            <span v-show="hasShotgun"> (dont moi)</span>
          </span>
          <v-btn color="primary" large :disabled="hasShotgun" @click="shotgun">
            Shotgun <v-icon right>mdi-account-multiple-plus</v-icon>
          </v-btn>
          <v-btn
            v-if="iAmChef"
            color="secondary"
            large
            @click="openRecordExpenseDialog"
          >
            Renseigner une dépense <v-icon right>mdi-cash-multiple</v-icon>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
    <v-dialog v-model="isRecordExpenseDialogOpen" max-width="600px">
      <RecordSharedMealExpenseForm
        :meal="shared"
        closable
        @close-dialog="closeRecordExpenseDialog"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  Adherent,
  OnGoingSharedMealBuilder,
  SharedMeal,
} from "@overbookd/personal-account";
import { nicknameOrName } from "@overbookd/user";
import RecordSharedMealExpenseForm from "~/components/organisms/personal-account/RecordSharedMealExpenseForm.vue";

type SharedMealCardData = {
  isRecordExpenseDialogOpen: boolean;
};

export default defineComponent({
  name: "SharedMealCard",
  components: { RecordSharedMealExpenseForm },
  props: {
    shared: {
      type: Object as () => SharedMeal,
      required: true,
    },
  },
  data: (): SharedMealCardData => ({
    isRecordExpenseDialogOpen: false,
  }),
  computed: {
    me(): Adherent {
      const { id, ...me } = this.$accessor.user.me;
      return { id, name: nicknameOrName(me) };
    },
    iAmChef(): boolean {
      return this.shared.chef.id === this.me.id;
    },
    guests(): string {
      return this.shared.shotgunCount > 1 ? "convives" : "convive";
    },
    hasShotgun(): boolean {
      return this.builder.hasShotgun(this.me.id);
    },
    builder(): OnGoingSharedMealBuilder {
      return OnGoingSharedMealBuilder.build(this.shared);
    },
    chefPersonalData() {
      return this.$accessor.user.users.find(
        ({ id }) => id === this.$accessor.mealSharing.sharedMeal?.chef.id,
      );
    },
  },
  methods: {
    shotgun(): void {
      this.$accessor.mealSharing.shotgun(this.shared.id);
    },
    openRecordExpenseDialog() {
      this.isRecordExpenseDialogOpen = true;
    },
    closeRecordExpenseDialog() {
      this.isRecordExpenseDialogOpen = false;
    },
  },
});
</script>

<style lang="scss" scoped>
.meal-title {
  text-transform: capitalize;
}
.presentation {
  display: flex;
  gap: 15px;
  align-items: center;
  @media only screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    align-items: center;
    min-width: 100%;
    .chief,
    .menu,
    .shotgun {
      min-width: 100%;
    }
  }
  .chief {
    flex-grow: 1;
    display: flex;
    align-items: baseline;
    gap: 3px;
    font-size: 1.2rem;
    i {
      font-size: 2rem;
    }
  }
  .menu {
    flex-grow: 3;
  }
  .shotgun {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}
</style>
