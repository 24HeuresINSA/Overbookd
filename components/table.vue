<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
      <tr>
        <th class="text-left" v-for="header in header">
          {{ header }}
        </th>
      </tr>
      </thead>
      <tbody>
      <tr
          v-for="item in data"
          :key="item.name"
      >
        <td></td>
        <td>{{ item.name }}</td>
        <td>{{ item.calories }}</td>
      </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  name: "table",
  props : [data],
  data() {
    return {
      headers: ['', 'name', 'start date', 'end date', 'created by']
    }
  }
}
</script>

<style scoped>

</style>