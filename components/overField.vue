<template>
  <div>
    <v-text-field
        v-model="field.value"
        v-if="field.type=== 'string' || field.type === undefined"
        :rules="field.rule"
        :counter="field.counter"
        :label="field.label ? field.label : field.key"
        required
    ></v-text-field>
    <v-switch
        v-model="field.value"
        :label="field.label ? field.label : field.key"
        v-else-if="field.type === 'switch'"
    ></v-switch>
    <v-select
        v-else-if="field.type === 'select'"
        :label="field.label ? field.label : field.key"
        v-model="field.value"
        :items="field.options"
    ></v-select>
    <v-datetime-picker
        v-if="field.type === 'datetime'"
        :label="field.label ? field.label : field.key"
        v-model="field.value"
    ></v-datetime-picker>
    <v-date-picker
        v-if="field.type === 'date'"
        :label="field.label ? field.label : field.key"
        v-model="field.date"
    ></v-date-picker>
    <v-time-picker
        v-if="field.type == 'time'"
        :label="field.label ? field.label : field.key"
        v-model="field.time"
    ></v-time-picker>
    <p v-if="field.description">{{ field.description }}</p>
  </div>
</template>

<script>
export default {
  name: "over-field",
  props: ["field"],
  mounted() {
    console.log('dads')
  },

  watch: {
    field: function (){
      console.log('field emitted ...')
      this.$emit('value', this.field)
    }
  }
}


</script>

<style scoped>

</style>