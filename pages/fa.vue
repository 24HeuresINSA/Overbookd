<template>
  <div>
    <v-data-iterator
      :items="FAs"
      item-key="id"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      :search="search"
      :sort-desc="sortDesc"
    >
      <template v-slot:header>
        <v-toolbar
            dark
            color="blue darken-3"
            class="mb-1"
        >
          <v-text-field
              v-model="search"
              clearable
              flat
              solo-inverted
              hide-details
              prepend-inner-icon="mdi-magnify"
              label="Search"
          ></v-text-field>
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer></v-spacer>
            <v-select
                v-model="sortBy"
                flat
                solo-inverted
                hide-details
                :items="keys"
                prepend-inner-icon="mdi-magnify"
                label="Sort by"
            ></v-select>
            <v-spacer></v-spacer>
            <v-btn-toggle
                v-model="sortDesc"
                mandatory
            >
              <v-btn
                  large
                  depressed
                  color="blue"
                  :value="false"
              >
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn
                  large
                  depressed
                  color="blue"
                  :value="true"
              >
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-toolbar>
      </template>

      <template v-slot:default="{ items, isExpanded, expand }">
        <v-row>
          <v-col
              v-for="item in items"
              :key="item.name"
              cols="12"
              sm="6"
              md="4"
              lg="3"
          >
            <v-card>
              <v-card-title>
                <h4>{{ item.name }}</h4>
              </v-card-title>
              <v-switch
                  :input-value="isExpanded(item)"
                  :label="isExpanded(item) ? 'Expanded' : 'Closed'"
                  class="pl-4 mt-0"
                  @change="(v) => expand(item, v)"
              ></v-switch>
              <v-divider></v-divider>
              <v-list
                  v-if="isExpanded(item)"
                  dense
              >
                <v-list-item>
                  <v-list-item-content>Desciption:</v-list-item-content>
                  <v-list-item-content class="align-end">
                    {{ item.description }}
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>Start date:</v-list-item-content>
                  <v-list-item-content class="align-end">
                    {{ item.startDate }}
                  </v-list-item-content>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>End date:</v-list-item-content>
                  <v-list-item-content class="align-end">
                    {{ item.endDate }}
                  </v-list-item-content>
                </v-list-item>


              </v-list>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </div>
</template>

<script>
export default {
  name: "fa",
  data(){
    return {
      FAs : [{
        id: 1,
        "name": "Ranger le QG orga",
        "description": "la manif est fini c\"était bien rigolo mais maintenant au boulot on range tout",
        "startDate": "2019/05/19 20:00:00",
        "endDate": "2019/05/20 18:00:00",
        "eventId": 1,
        "supervisorId": 3,
        status: 'draft'
      },{
        id: 2,
        "name": "Ramener le fromage à la maison",
        "description": "on a acheté bcp bcp (bcp) de fromage et on doit le stocker dans le frigos",
        "startDate": "2019/05/11 12:00:00",
        "endDate": "2019/05/11 18:00:00",
        "eventId": 1,
        "supervisorId": 2,
        status: 'submitted'
      },],
      itemsPerPageArray: [4, 8, 12],
      search: '',
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 4,
      sortBy: 'name',
      keys: [
        'id',
        'name',
        'description',
        'startDate',
        'endDate',
        'status',
        'eventId',
        'supervisorId',
      ],
    }
  },
  computed: {
    numberOfPages () {
      return Math.ceil(this.items.length / this.itemsPerPage)
    },
    filteredKeys () {
      return this.keys.filter(key => key !== 'Name')
    },
  },
  methods: {
    nextPage () {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage () {
      if (this.page - 1 >= 1) this.page -= 1
    },
    updateItemsPerPage (number) {
      this.itemsPerPage = number
    },
  },
}
</script>

<style scoped>

</style>