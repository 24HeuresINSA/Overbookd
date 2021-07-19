<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="FAs"
        :items-per-page="5"
        class="elevation-1"
    >
      <template v-slot:item.action="row">
        <tr>
          <td>
            <v-btn class="mx-2" fab dark small color="primary" @click="onItemSelected(row.item)">
              <v-icon dark>mdi-circle-edit-outline</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>

      <template v-slot:item.status="row">
        <v-avatar
            v-if="row.item"
            :color="color[row.item.status]"
            size="20"
        ></v-avatar>

      </template>
    </v-data-table>

    <v-btn
        color="secondary"
        elevation="2"
        fab
        to="/fa/newFA"
        class="fab-right"
    >
      <v-icon>
        mdi-plus-thick
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "fa",
  data() {
    return {
      FAs: [],
      itemsPerPageArray: [4, 8, 12],
      search: '',
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 4,
      sortBy: 'name',
      headers: [
        { text: 'status', value: 'status'},
        { text: 'nom', value: 'name'},
        { text: 'equipe', value: 'team'},
        { text: 'action', value: 'action'},
      ],
      color: {
        submitted: 'warning',
        validated: 'green',
        refused: 'red',
        draft: 'grey',
        undefined: 'grey',
      },
    }
  },

  computed: {
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage)
    },
  },

  methods: {
    onItemSelected(item){
      this.$router.push({path: 'fa/' + item.name})
    },

    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number
    },
  },
  async mounted() {
    // get FAs
    this.FAs = (await this.$axios.get('/FA')).data;
    console.log(this.FAs)

  }
}
</script>

<style scoped>
.fab-right {
  position: absolute;
  right: 10px;
  bottom: 10px;
}
</style>