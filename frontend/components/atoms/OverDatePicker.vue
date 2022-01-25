<template>
  <v-dialog
    ref="dialog"
    v-model="modal"
    :return-value.sync="date"
    persistent
    width="290px"
  >
    <template #activator="{ on, attrs }">
      <v-text-field
        v-model="date"
        :label="label"
        prepend-icon="mdi-calendar"
        readonly
        v-bind="attrs"
        :rules="rules"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="date"
      scrollable
      :date-format="(date) => new Date(date).toDateString()"
      :show-current="true"
    >
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="modal = false"> Cancel </v-btn>
      <v-btn text color="primary" @click="save2(date)"> OK </v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script>
export default {
  name: "OverDatePicker",
  props: {
    label: {
      type: String,
      default: "",
    },
    rules: {
      type: Array,
      default: () => [(v) => !!v || "Date requise"],
    },
  },
  data() {
    return {
      modal: false,
      date: this.dDate,
    };
  },
  methods: {
    save2(date) {
      this.$refs.dialog.save(this.date);
      this.$emit("update:date", date);
    },
  },
};
</script>

<style></style>
