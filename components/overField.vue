<template>
  <div>
    <v-text-field
        v-model="field.value"
        v-if="field.type=== 'string' || field.type === undefined"
        :rules="field.rule"
        :type="field.option"
        :counter="field.counter"
        :label="(field.label ? field.label : field.key) + (field.isRequired ? '*' : '')"
        @change="onChange"

    ></v-text-field>
    <v-textarea
        v-model="field.value"
        v-else-if="field.type=== 'textarea'"
        :label="field.label ? field.label : field.key"
        @change="onChange"
        required
    ></v-textarea>
    <v-switch
        v-model="field.value"
        :label="field.label ? field.label : field.key"
        v-else-if="field.type === 'switch'"
        @change="onChange"
    ></v-switch>
    <v-select
        v-else-if="field.type === 'select'"
        :label="field.label ? field.label : field.key"
        v-model="field.value"
        :items="field.options"
        @change="onChange"
    ></v-select>
    <v-datetime-picker
        v-if="field.type === 'datetime'"
        :label="field.label ? field.label : field.key"
        v-model="field.value"
        @change="onChange"
    ></v-datetime-picker>
    <div v-if="field.type === 'date'">
      <p>{{field.label ? field.label : field.key}}</p>
      <v-date-picker
          :label="field.label ? field.label : field.key"
          v-model="field.value"
          :active-picker.sync="activePicker"
          @change="onChange"
      ></v-date-picker>
    </div>
    <v-select
        v-else-if="field.type === 'user'"
        :label="field.label ? field.label : field.key"
        v-model="field.value"
        :items="users"
        @change="onChange"
    ></v-select>

    <v-time-picker
        v-if="field.type === 'time'"
        :label="field.label ? field.label : field.key"
        v-model="field.value"
        @change="onChange"
        format="24hr"
        :allowed-minutes="allowedMinutes"
    ></v-time-picker>
    <p v-if="field.description">{{ field.description }}</p>

  </div>
</template>

<script>
export default {
  name: "over-field",
  props: ["field"],
  data(){
    return {
      activePicker: null,
      menu: false,
      users: undefined,
    }
  },

  methods: {
    onChange(){
      if(typeof this.field.value === 'string'){
        this.field.value = this.field.value.trim();
      }
      this.$emit('value', {key: this.field.key, value: this.field.value})
    },

    allowedMinutes: m => m % 15 === 0,
  },

  async mounted() {
    if(this.field.type === 'user'){
      this.users = (await this.$axios.get('/user/all')).data;
    }
  },
}


</script>

<style scoped>

</style>