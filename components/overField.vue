<template>
  <div>
    <v-text-field
      v-if="mField.type === 'string' || mField.type === undefined"
      v-model="mField.value"
      :rules="
        field.regex
          ? [
              (v) =>
                new RegExp(field.regex).test(v) ||
                (field.errorMessage
                  ? field.errorMessage
                  : `il y'a un probleme avec ce champ`),
            ]
          : []
      "
      :type="mField.option"
      :counter="mField.counter"
      :label="
        (mField.label ? mField.label : mField.key) +
        (mField.isRequired ? '*' : '')
      "
      @change="onChange"
    ></v-text-field>
    <v-textarea
      v-else-if="mField.type === 'textarea'"
      v-model="mField.value"
      :label="mField.label ? mField.label : mField.key"
      required
      @change="onChange"
    ></v-textarea>
    <v-switch
      v-else-if="mField.type === 'switch'"
      v-model="mField.value"
      :label="mField.label ? mField.label : mField.key"
      @change="onChange"
    ></v-switch>
    <v-select
      v-else-if="mField.type === 'select'"
      v-model="mField.value"
      :label="mField.label ? mField.label : mField.key"
      :items="mField.options"
      @change="onChange"
    ></v-select>
    <v-datetime-picker
      v-if="mField.type === 'datetime'"
      v-model="mField.value"
      :label="mField.label ? mField.label : mField.key"
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
        v-model="mField.value"
        :label="mField.label ? mField.label : mField.key"
        :active-picker.sync="activePicker"
        @change="onChange"
      ></v-date-picker>
    </div>
    <v-autocomplete
      v-else-if="mField.type === 'user'"
      v-model="mField.value"
      :label="mField.label ? mField.label : mField.key"
      :items="users"
      @change="onChange"
    ></v-autocomplete>

    <v-time-picker
      v-if="mField.type === 'time'"
      v-model="mField.value"
      :label="mField.label ? mField.label : mField.key"
      format="24hr"
      :allowed-minutes="allowedMinutes"
      @change="onChange"
    ></v-time-picker>
    <p v-if="mField.description">{{ mField.description }}</p>
  </div>
</template>

<script>
export default {
  name: "OverField",
  props: ["field"],
  data() {
    return {
      activePicker: null,
      menu: false,
      users: undefined,
      mField: this.field,
    };
  },

  async mounted() {
    if (this.field.type === "user") {
      let users = (await this.$axios.get("/user/all")).data;
      this.users = users.map((user) => {
        return {
          text: user.username,
          value: user,
        };
      });
    }
  },

  methods: {
    onChange() {
      if (typeof this.field.value === "string") {
        this.mField.value = this.mField.value.trim();
      }
      this.$emit("value", { key: this.field.key, value: this.field.value });
    },

    allowedMinutes: (m) => m % 15 === 0,
  },
};
</script>

<style scoped></style>
