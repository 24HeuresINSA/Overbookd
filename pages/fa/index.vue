<template>
  <div>
    <!--    <v-data-iterator-->
    <!--        :items="FAs"-->
    <!--        item-key="id"-->
    <!--        :items-per-page.sync="itemsPerPage"-->
    <!--        :page.sync="page"-->
    <!--        :search="search"-->
    <!--        :sort-desc="sortDesc"-->
    <!--    >-->
    <!--      <template v-slot:header>-->
    <!--        <v-toolbar-->
    <!--            dark-->
    <!--            color="blue darken-3"-->
    <!--            class="mb-1"-->
    <!--        >-->
    <!--          <v-text-field-->
    <!--              v-model="search"-->
    <!--              clearable-->
    <!--              flat-->
    <!--              solo-inverted-->
    <!--              hide-details-->
    <!--              prepend-inner-icon="mdi-magnify"-->
    <!--              label="Search"-->
    <!--          ></v-text-field>-->
    <!--          <template v-if="$vuetify.breakpoint.mdAndUp">-->
    <!--            <v-spacer></v-spacer>-->
    <!--            <v-select-->
    <!--                v-model="sortBy"-->
    <!--                flat-->
    <!--                solo-inverted-->
    <!--                hide-details-->
    <!--                :items="keys"-->
    <!--                prepend-inner-icon="mdi-magnify"-->
    <!--                label="Sort by"-->
    <!--            ></v-select>-->
    <!--            <v-spacer></v-spacer>-->
    <!--            <v-btn-toggle-->
    <!--                v-model="sortDesc"-->
    <!--                mandatory-->
    <!--            >-->
    <!--              <v-btn-->
    <!--                  large-->
    <!--                  depressed-->
    <!--                  color="blue"-->
    <!--                  :value="false"-->
    <!--              >-->
    <!--                <v-icon>mdi-arrow-up</v-icon>-->
    <!--              </v-btn>-->
    <!--              <v-btn-->
    <!--                  large-->
    <!--                  depressed-->
    <!--                  color="blue"-->
    <!--                  :value="true"-->
    <!--              >-->
    <!--                <v-icon>mdi-arrow-down</v-icon>-->
    <!--              </v-btn>-->
    <!--            </v-btn-toggle>-->
    <!--          </template>-->
    <!--        </v-toolbar>-->
    <!--      </template>-->

    <!--      <template v-slot:default="{ items, isExpanded, expand }">-->
    <!--        <v-row>-->
    <!--          <v-col-->
    <!--              v-for="item in items"-->
    <!--              :key="item.name"-->
    <!--              cols="12"-->
    <!--              sm="6"-->
    <!--              md="4"-->
    <!--              lg="3"-->
    <!--          >-->
    <!--            <v-card>-->
    <!--              <v-card-title>-->
    <!--                <v-icon color="green" v-if="item.status === 'validated'">mdi-check-circle</v-icon>-->
    <!--                <v-icon color="orange" v-else-if="item.status === 'submitted'">mdi-account-reactivate</v-icon>-->
    <!--                <v-icon color="red" v-else-if="item.status === 'canceled'">mdi-cancel</v-icon>-->
    <!--                <v-icon v-else >mdi-circle-edit-outline</v-icon>-->
    <!--                <h4>{{ item.name }}</h4>-->
    <!--              </v-card-title>-->
    <!--              <v-switch-->
    <!--                  :input-value="isExpanded(item)"-->
    <!--                  :label="isExpanded(item) ? 'Expanded' : 'Closed'"-->
    <!--                  class="pl-4 mt-0"-->
    <!--                  @change="(v) => expand(item, v)"-->
    <!--              ></v-switch>-->
    <!--              <v-divider></v-divider>-->
    <!--              <v-list-->
    <!--                  v-if="isExpanded(item)"-->
    <!--                  dense-->
    <!--              >-->
    <!--                <v-list-item>-->
    <!--                  <v-list-item-content>Desciption:</v-list-item-content>-->
    <!--                  <v-list-item-content class="align-end">-->
    <!--                    {{ item.description }}-->
    <!--                  </v-list-item-content>-->
    <!--                </v-list-item>-->

    <!--                <v-list-item>-->
    <!--                  <v-list-item-content>Start date:</v-list-item-content>-->
    <!--                  <v-list-item-content class="align-end">-->
    <!--                    {{ item.startDate }}-->
    <!--                  </v-list-item-content>-->
    <!--                </v-list-item>-->

    <!--                <v-list-item>-->
    <!--                  <v-list-item-content>End date:</v-list-item-content>-->
    <!--                  <v-list-item-content class="align-end">-->
    <!--                    {{ item.endDate }}-->
    <!--                  </v-list-item-content>-->
    <!--                </v-list-item>-->


    <!--              </v-list>-->
    <!--            </v-card>-->
    <!--          </v-col>-->
    <!--        </v-row>-->
    <!--      </template>-->
    <!--    </v-data-iterator>-->
    <v-data-table
        :headers="headers"
        :items="FAs"
        :items-per-page="5"
        class="elevation-1"
    >
      <template v-slot:item="row">
        <tr>
          <td v-for="header of headers">{{row.item[header.value]}}</td>
          <td>
            <v-btn class="mx-2" fab dark small color="primary" @click="onItemSelected(row.item)">
              <v-icon dark>mdi-circle-edit-outline</v-icon>
            </v-btn>
          </td>
        </tr>
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
        { text: 'nom', value: 'name'},
        { text: 'equipe', value: 'team'},
        { text: 'status', value: 'status'},
      ],
      keys: [
        'name',
        'description',
        'team',
        'status',
      ],
    }
  },

  computed: {
    numberOfPages() {
      return Math.ceil(this.items.length / this.itemsPerPage)
    },
    filteredKeys() {
      return this.keys.filter(key => key !== 'Name')
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