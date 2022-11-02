<template>
  <div>
    <v-text-field
      v-if="mField.type === 'string' || mField.type === undefined"
      :value="data"
      :rules="
        field.regex
          ? [
              (v) =>
                new RegExp(field.regex).test(v) ||
                (field.errorMessage
                  ? field.errorMessage
                  : `il y'a un problème avec ce champ`),
            ]
          : []
      "
      :type="mField.option"
      :counter="mField.counter"
      :label="
        (mField.label ? mField.label : mField.key) +
        (mField.isRequired ? '*' : '')
      "
      :disabled="disabled"
      @change="onChange"
    ></v-text-field>
    <v-textarea
      v-else-if="mField.type === 'textarea'"
      :value="data"
      :label="mField.label ? mField.label : mField.key"
      required
      :disabled="disabled"
      @change="onChange"
    ></v-textarea>
    <RichEditor
      v-else-if="mField.type === 'rich-text'"
      :value="data"
      :disabled="disabled"
      :data="data"
      @change="onChange"
    ></RichEditor>
    <v-switch
      v-else-if="mField.type === 'switch'"
      :value="data"
      :label="mField.label ? mField.label : mField.key"
      :disabled="disabled"
      @change="onChange"
    ></v-switch>
    <v-select
      v-else-if="mField.type === 'select'"
      :value="data"
      :label="mField.label ? mField.label : mField.key"
      :items="mField.options"
      :disabled="disabled"
      :multiple="mField.multiple"
      dense
      @change="onChange"
    ></v-select>
    <v-autocomplete
      v-else-if="mField.type === 'autocomplete'"
      :value="data"
      :label="mField.label ? mField.label : mField.key"
      :items="mField.options"
      :disabled="disabled"
      :multiple="mField.multiple"
      dense
      @change="onChange"
    ></v-autocomplete>
    <v-select
      v-else-if="mField.type === 'teams'"
      :value="data"
      :label="mField.label ? mField.label : mField.key"
      :items="teams"
      :disabled="disabled"
      dense
      @change="onChange"
    ></v-select>
    <v-datetime-picker
      v-if="mField.type === 'datetime'"
      :value="data"
      :label="mField.label ? mField.label : mField.key"
      :disabled="disabled"
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
        :value="data"
        :label="mField.label ? mField.label : mField.key"
        :active-picker.sync="activePicker"
        :disabled="disabled"
        @change="onChange"
      ></v-date-picker>
    </div>
    <v-autocomplete
      v-else-if="mField.type === 'user'"
      :value="data"
      :label="mField.label ? mField.label : mField.key"
      :items="users"
      :disabled="disabled"
      dense
      @change="onChange"
    ></v-autocomplete>
    <v-autocomplete
      v-else-if="mField.type === 'validated_user'"
      :value="data"
      :label="mField.label ? mField.label : mField.key"
      :items="validatedUsers"
      :disabled="disabled"
      dense
      @change="onChange"
    ></v-autocomplete>

    <v-time-picker
      v-if="mField.type === 'time'"
      :value="data"
      :label="mField.label ? mField.label : mField.key"
      format="24hr"
      :allowed-minutes="allowedMinutes"
      :disabled="disabled"
      @change="onChange"
    ></v-time-picker>
    <p v-if="mField.description">{{ mField.description }}</p>
  </div>
</template>

<script>
import RichEditor from "~/components/organisms/richEditor";
import userRepo from "~/repositories/userRepo";

export default {
  name: "OverField",
  components: { RichEditor },
  props: {
    field: {
      type: Object,
      default: () => undefined,
    },
    data: {
      type: Object,
      default: () => undefined,
    },
    disabled: Boolean,
  },
  data() {
    return {
      activePicker: null,
      menu: false,
      users: undefined,
      validatedUsers: undefined,
      mField: this.field,
      value: undefined,
      teams: [],
    };
  },

  async mounted() {
    if (this.field.type === "user") {
      let users = this.$accessor.user.usernames;
      if (users.length === 0) {
        // fetch usernames
        await this.$accessor.user.getUsername();
        users = this.$accessor.user.usernames;
      }
      // sort alphabetically
      this.users = users.map((user) => {
        return {
          text: user.username,
          value: user,
        };
      });
    }
    if (this.field.type == "validated_user") {
      await userRepo.getAllUsers(this).then((res) => {
        let users = res.data
          .map((user) => {
            if (user.team) {
              if (user.team.includes("hard") || user.team.includes("soft")) {
                const username = user.firstname + " " + user.lastname;
                return { text: username, value: user };
              }
            }
          })
          .filter((item) => item);
        this.validatedUsers = users;
      });
    }
    if (this.field.type === "teams") {
      this.teams = this.$accessor.team.teamNames;
    }
  },

  methods: {
    onChange(value) {
      if (typeof this.field.value === "string") {
        value = value.trim();
      }
      if (this.field.type === "number") {
        try {
          value = +value;
        } catch (e) {
          console.log(e);
        }
      }
      this.$emit("value", { key: this.field.key, value });
    },

    allowedMinutes: (m) => m % 15 === 0,
  },
};
</script>

<style scoped></style>
