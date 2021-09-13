<template>
  <div>
    <v-text-field
        v-model="mField.value"
        v-if="mField.type === 'string' || mField.type === undefined"
        :rules="mField.rule"
        :type="mField.option"
        :counter="mField.counter"
        :label="
        (mField.label ? mField.label : mField.key) +
        (mField.isRequired ? '*' : '')
      "
        @change="onChange"
    ></v-text-field>
    <v-textarea
        v-model="mField.value"
        v-else-if="mField.type === 'textarea'"
        :label="mField.label ? mField.label : mField.key"
        @change="onChange"
        required
    ></v-textarea>
    <v-switch
        v-model="mField.value"
        :label="mField.label ? mField.label : mField.key"
        v-else-if="mField.type === 'switch'"
        @change="onChange"
    ></v-switch>
    <v-select
        v-else-if="mField.type === 'select'"
        :label="mField.label ? mField.label : mField.key"
        v-model="mField.value"
        :items="mField.options"
        @change="onChange"
    ></v-select>
    <v-datetime-picker
        v-if="mField.type === 'datetime'"
        :label="mField.label ? mField.label : mField.key"
        v-model="mField.value"
        @change="onChange"
    ></v-datetime-picker>
    <div v-if="mField.type === 'date'">
      <p>
        {{
          (mField.label ? mField.label : mField.key) +
          (mField.isRequired ? "*" : "")
        }}
      </p>
      <v-date-picker
          :label="mField.label ? mField.label : mField.key"
          v-model="mField.value"
          :active-picker.sync="activePicker"
          @change="onChange"
      ></v-date-picker>
    </div>
    <v-autocomplete
        v-else-if="mField.type === 'user'"
        :label="mField.label ? mField.label : mField.key"
        v-model="mField.value"
        :items="users"
        @change="onChange"
    ></v-autocomplete>

    <v-time-picker
        v-if="mField.type === 'time'"
        :label="mField.label ? mField.label : mField.key"
        v-model="mField.value"
        @change="onChange"
        format="24hr"
        :allowed-minutes="allowedMinutes"
    ></v-time-picker>
    <p v-if="mField.description">{{ mField.description }}</p>
  </div>
</template>

<script>
export default {
  name: "over-field",
  props: ["field"],
  data() {
    return {
      activePicker: null,
      menu: false,
      users: undefined,
      mField: this.field,
    };
  },

  methods: {
    onChange() {
      if (typeof this.field.value === "string") {
        this.mField.value = this.field.value.trim();
      }
      this.$emit("value", { key: this.field.key, value: this.field.value });
    },

    allowedMinutes: (m) => m % 15 === 0,
  },

  async mounted() {
    if (this.field.type === "user") {
      this.users = (await this.$axios.get("/user/all")).data;
    }
  },
};
</script>

<style scoped></style>
