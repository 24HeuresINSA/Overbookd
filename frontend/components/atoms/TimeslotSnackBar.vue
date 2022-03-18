<template>
  <div class="text-center ma-2">
    <v-snackbar v-model="snackbar">
      {{ message }}

      <template #action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="dismiss()">
          Fermer
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: "TimeslotSnackBar",
  data() {
    return {
      snackbar: false,
      message: ""
    };
  },
  created() {
    this.$store.subscribe((mutation) => {
      if (mutation.type === "timeslot/SET_CREATE_STATUS" && mutation.payload) {
        this.message = mutation.payload;
        this.snackbar = true;
      }
    });
  },
  methods: {
    dismiss: function () {
      this.snackbar = false;
      //reset message
      this.$store.dispatch("setSnackbar", {
        message: "",
      });
    },
  },
};
</script>

<style></style>
