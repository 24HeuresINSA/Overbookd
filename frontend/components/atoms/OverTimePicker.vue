<template>
  <v-dialog
    ref="dialog"
    v-model="modal2"
    :return-value.sync="time"
    persistent
    width="290px"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        v-model="time"
        :label="label"
        prepend-icon="mdi-clock-time-four-outline"
        readonly
        v-bind="attrs"
        :rules="rules"
        v-on="on"
      ></v-text-field>
    </template>
    <v-time-picker
      v-if="modal2"
      v-model="time"
      full-width
      format="24hr"
      :allowed-hours="allowedHours"
      :allowed-minutes="allowedMinutes"
    >
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="modal2 = false"> Annuler </v-btn>
      <v-btn
        text
        color="primary"
        @click="
          $refs.dialog.save(time);
          $emit('update:time', time);
        "
      >
        OK
      </v-btn>
    </v-time-picker>
  </v-dialog>
</template>
<script>
export default {
  name: "OverTimePicker",
  props: {
    label: {
      type: String,
      default: "",
    },
    rules: {
      type: Array,
      default: () => [(v) => !!v || "Heure requise"],
    },
  },
  data() {
    return {
      modal2: false,
      time: this.dTime,
    };
  },
  methods: {
    allowedHours: (v) => v % 2 === 0,
    allowedMinutes: (v) => v === 0,
  },
};
</script>

<style></style>
