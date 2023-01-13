<template>
  <v-card class="inventory-record">
    <v-btn class="close-btn" icon @click="closeDialog">
      <v-icon>mdi-close</v-icon>
    </v-btn>
    <v-card-title class="inventory-record__title">
      <h2>Entree de l'inventaire</h2>
    </v-card-title>
    <v-card-text>
      <form>
        <div class="fields">
          <SearchGear
            v-model="gear"
            :label="gearHelpMessage"
            :dense="true"
          ></SearchGear>
          <span class="fields--imutable">
            Quantite: {{ inventoryError?.record.quantity }}
          </span>
          <span class="fields--imutable">
            Lieu de stockage: {{ inventoryError?.record.storage }}
          </span>
        </div>
        <v-btn
          color="success"
          large
          :disabled="isNotValidForm"
          @click="addToInventory"
        >
          <v-icon left> mdi-checkbox-marked-circle-outline </v-icon>
          Ajouter l'entree a l'inventaire
        </v-btn>
      </form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import SearchGear from "~/components/atoms/SearchGear.vue";
import { DisplayableManualInventoryRecordError } from "~/domain/inventory/manual-inventory-record";
import { Gear } from "~/utils/models/catalog.model";
import { InputRulesData } from "~/utils/rules/inputRules";

interface InventoryRecordFormData extends InputRulesData {
  gear?: Gear;
}

export default Vue.extend({
  name: "InventoryRecordForm",
  components: { SearchGear },
  props: {
    inventoryError: {
      type: DisplayableManualInventoryRecordError,
      default: () =>
        ({
          record: {
            gear: "",
            quantity: 0,
            storage: "",
          },
          toInventoryRecord: () => new Error(),
        } as unknown as DisplayableManualInventoryRecordError),
    },
  },
  data(): InventoryRecordFormData {
    return {
      gear: undefined as Gear | undefined,
      rules: {},
    };
  },
  computed: {
    isNotValidForm(): boolean {
      return !this.gear;
    },
    gearHelpMessage(): string {
      return `${this.inventoryError.record.gear} a ete cherche precedement`;
    },
  },
  watch: {
    inventoryError: function () {
      this.gear = undefined;
    },
  },
  methods: {
    closeDialog() {
      this.$emit("close-dialog");
    },
    addToInventory() {
      if (!this.gear) return;
      const inventoryRecord = this.inventoryError.toInventoryRecord(this.gear);
      this.$emit("add-to-inventory", inventoryRecord);
      this.closeDialog();
    },
  },
});
</script>

<style lang="scss" scoped>
.inventory-record {
  &__title {
    display: flex;
    justify-content: center;
    h2 {
      flex: 1;
      text-align: center;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    .fields {
      width: 80%;
      display: flex;
      flex-direction: column;
      gap: 5px;
      &--immutable {
        font-size: 1.7rem;
        color: black;
      }
    }
  }

  .close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
  }
}
</style>
