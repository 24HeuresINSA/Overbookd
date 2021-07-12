<template>
  <div>
    <over-field
        v-for="field in fields"
        :key="field.label"
        :field="field"
    >
    </over-field>
  </div>
</template>

<script>
import OverField from "./overField";

export default {
  name: "over-form",
  components: {OverField},
  props: ["fields"],
  mounted() {
  }
}
</script>

<style scoped>

</style>