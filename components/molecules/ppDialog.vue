<template>
  <v-dialog v-model="toggled" max-width="600">
    <v-card>
      <v-card-text>
        <v-file-input v-model="PP"> </v-file-input>
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="uploadPP()">Enregistrer</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { DialogState } from "~/store/dialog";
import { UserState } from "~/store/user";
import { safeCall } from "~/utils/api/calls";
import { dispatch } from "~/utils/store";
import { TMapState } from "~/utils/types/store";
export default Vue.extend({
  name: "PPDialog",
  data() {
    return {
      //! Not safe
      PP: {} as any,
    };
  },
  computed: {
    ...mapState<any, TMapState<DialogState>>("dialog", {
      type: (state: DialogState) => state.type,
      open: (state: DialogState) => state.open,
    }),
    ...mapState<any, TMapState<UserState>>("user", {
      me: (state) => state.me,
    }),
    toggled: {
      get: function (): boolean | unknown {
        if (this.type == "pp") {
          return this.open;
        }
        if (!this.open) {
          return false;
        }
        return false;
      },
      set(val): void {
        if (!val) {
          this.$store.dispatch("dialog/closeDialog");
        }
      },
    },
  },
  methods: {
    uploadPP: async function () {
      if (this.me) {
        let form = new FormData();
        form.append("files", this.PP, this.PP.name);
        form.append("_id", this.me._id);
        const res = await safeCall(
          this.$store,
          RepoFactory.get("user").addPP(this, form)
        );
        if (res) {
          dispatch(this, "notif", "pushNotification", {
            type: "success",
            message: "PP added please reload the page",
          });
          this.$store.dispatch("dialog/closeDialog");
        }
      }
    },
  },
});
</script>
