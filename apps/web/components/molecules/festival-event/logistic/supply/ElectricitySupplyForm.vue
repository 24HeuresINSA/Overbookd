<template>
  <v-card class="supply-card">
    <v-btn class="supply-card__close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <v-card-title class="supply-card__title">
      <h2>{{ typeFormLabel }} un besoin en électricité</h2>
    </v-card-title>

    <v-card-subtitle>
      Les champs marqués par <strong>*</strong> sont obligatoires.
    </v-card-subtitle>

    <v-img src="/img/log/plugs.png" class="supply-card__img" />

    <v-card-text>
      <v-select
        v-model="connection"
        type="select"
        label="Type de branchement *"
        :items="connectionWithLabels"
        item-value="connection"
        item-text="label"
        @keydown.enter="confirmSupply"
      />
      <v-text-field
        v-model="device"
        label="Appareil *"
        @keydown.enter="confirmSupply"
      />
      <v-text-field
        v-model="power"
        label="Puissance par appareil *"
        type="number"
        suffix="Watts"
        :rules="[rules.number, rules.min]"
        @keydown.enter="confirmSupply"
      />
      <v-text-field
        v-model="count"
        type="number"
        label="Nombre *"
        :rules="[rules.number, rules.min]"
        @keydown.enter="confirmSupply"
      />
      <v-text-field
        v-model="comment"
        label="Commentaire"
        @keydown.enter="confirmSupply"
      />
    </v-card-text>

    <v-card-actions class="supply-card__actions">
      <v-btn
        :disabled="!canConfirmSupply"
        color="success"
        @click="confirmSupply"
      >
        <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>
        {{ typeFormLabel }} le besoin
        <span class="desktop">en électricité</span>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import {
  ElectricityConnection,
  ElectricitySupply,
  PC16_Prise_classique,
} from "@overbookd/festival-event";
import { defineComponent } from "vue";
import {
  electricityConnectionLabels,
  ElectricityConnectionWithLabel,
} from "~/utils/festival-event/festival-activity.model";
import { isNumber, min } from "~/utils/rules/input.rules";

interface ElectricityNeedData {
  connection: ElectricityConnection;
  device: string;
  power: number;
  count: number;
  comment: string | null;
  rules: {
    number: (v: string) => boolean | string;
    min: (v: string) => boolean | string;
  };
}

export default defineComponent({
  name: "ElectricitySupplyForm",
  props: {
    supply: {
      type: Object as () => ElectricitySupply | null,
      default: () => null,
    },
  },
  data: ({ supply }): ElectricityNeedData => ({
    connection: supply?.connection ?? PC16_Prise_classique,
    device: supply?.device ?? "",
    power: supply?.power ?? 100,
    count: supply?.count ?? 1,
    comment: supply?.comment ?? null,
    rules: {
      number: isNumber,
      min: min(1),
    },
  }),
  computed: {
    connectionWithLabels(): ElectricityConnectionWithLabel[] {
      return [...electricityConnectionLabels.entries()].map(
        ([connection, label]) => ({
          connection,
          label,
        }),
      );
    },
    isUpdate(): boolean {
      return this.supply !== null;
    },
    canConfirmSupply(): boolean {
      const hasDevice = this.device.trim() !== "";
      const hasPower = this.power > 0;
      const hasCount = this.count > 0;
      return hasDevice && hasPower && hasCount;
    },
    typeFormLabel(): string {
      return this.isUpdate ? "Modifier" : "Ajouter";
    },
  },
  watch: {
    supply() {
      this.setSupply();
    },
  },
  async mounted() {
    this.setSupply();
  },
  methods: {
    confirmSupply() {
      if (!this.canConfirmSupply) return;

      const comment = this.comment?.trim();
      const supply = {
        connection: this.connection,
        device: this.device.trim(),
        power: +this.power,
        count: +this.count,
        comment: comment !== "" ? comment : null,
      };

      if (this.isUpdate) {
        this.$emit("update", { ...supply, id: this.supply?.id });
      } else {
        this.$emit("add", supply);
      }
      this.closeDialog();
      this.clearSupply();
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
    setSupply() {
      if (!this.supply) return this.clearSupply();

      this.connection = this.supply.connection;
      this.device = this.supply.device;
      this.power = this.supply.power;
      this.count = this.supply.count;
      this.comment = this.supply.comment;
    },
    clearSupply() {
      this.connection = PC16_Prise_classique;
      this.device = "";
      this.power = 100;
      this.count = 1;
      this.comment = null;
    },
  },
});
</script>

<style lang="scss" scoped>
.supply-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  &__title {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    h2 {
      flex: 1;
      text-align: center;
    }
  }
  &__form {
    padding-bottom: 0;
  }
  &__actions {
    margin-bottom: 10px;
  }
  &__close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
  }
  &__img {
    width: 100%;
    max-width: 350px;
    margin-bottom: 10px;
  }
  strong {
    font-weight: 900;
  }
  .desktop {
    @media only screen and (max-width: $mobile-max-width) {
      display: none;
    }
  }
}
</style>
