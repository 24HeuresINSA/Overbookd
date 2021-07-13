<template>
  <div>
    <v-text-field
        v-model="value"
        v-if="field.type=== 'string' || field.type === undefined"
        :rules="field.rule"
        :counter="field.counter"
        :label="field.label ? field.label : field.key"
        @change="onChange"
        required
    ></v-text-field>
    <v-switch
        v-model="value"
        :label="field.label ? field.label : field.key"
        v-else-if="field.type === 'switch'"
    ></v-switch>
    <v-select
        v-else-if="field.type === 'select'"
        :label="field.label ? field.label : field.key"
        v-model="value"
        :items="field.options"
    ></v-select>
    <v-datetime-picker
        v-if="field.type === 'datetime'"
        :label="field.label ? field.label : field.key"
        v-model="value"
    ></v-datetime-picker>
    <div v-if="field.type === 'date'">
      <p>{{field.label ? field.label : field.key}}</p>
      <v-date-picker
          :label="field.label ? field.label : field.key"
          v-model="value"
      ></v-date-picker>
    </div>

    <v-time-picker
        v-if="field.type == 'time'"
        :label="field.label ? field.label : field.key"
        v-model="value"
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
      value: undefined,
    }
  },

  methods: {
    onChange(){
      this.$emit('value', this.value)
    }
  },

  mounted() {
  },

  watch: {
    field: function (){
      console.log('field emitted ...' + this.field.value)
      this.$emit('value', this.field)
    }
  }
}


</script>

<style scoped>

</style>