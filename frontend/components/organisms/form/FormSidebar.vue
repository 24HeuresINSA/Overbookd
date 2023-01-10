<template>
  <div class="sidebar">
    <h1>{{ titleWithId }}</h1>
    <h2>Nom FT</h2>
    <div class="status">
      <span class="dot grey"></span>
      <h3>Status</h3>
    </div>
    <div class="icons">
      <div class="icon">
        <v-icon color="grey" size="26"> mdi-account </v-icon>
        <span class="icon-detail">Nom</span>
      </div>
    </div>
    <FormSummary class="summary" form="FT"></FormSummary>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import FormSummary from "./FormSummary.vue";

export default Vue.extend({
  name: "FormSidebar",
  components: { FormSummary },
  props: {
    form: {
      type: String,
      default: () => "FA",
    },
  },
  computed: {
    titleWithId(): string {
      const id =
        this.form === "FA" ? +this.$route.params.fa : +this.$route.params.ft;
      return `Fiche Tâches n°${id}`;
    },
  },
});
</script>

<style lang="scss" scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  overflow: auto;
  padding-right: 20px;
  width: 300px;

  h1 {
    font-size: 1.7rem;
    margin: 16px;
    margin-bottom: 4px;
  }

  h2 {
    font-size: 1.2rem;
    font-weight: normal;
    color: rgb(89, 89, 89);
    margin: 16px;
    margin-top: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: auto;
    display: block;
    overflow: hidden;
  }

  .status {
    display: flex;
    align-items: center;

    .dot {
      height: 25px;
      width: 25px;
      background-color: #bbb;
      border-radius: 50%;
      display: inline-block;
      margin-left: 16px;
      margin-right: 10px;
    }
  }

  .icons {
    display: flex;
    justify-content: space-between;
    margin: 20px 5px 15px 16px;

    .icon {
      position: relative;
      display: inline-block;

      .icon-detail {
        visibility: hidden;
        width: 60px;
        font-size: 0.9rem;
        text-align: center;
        border-radius: 6px;
        user-select: none;

        position: absolute;
        z-index: 1;
        top: 100%;
        left: 50%;
        margin-left: -30px;
      }
    }
  }

  .icon:hover .icon-detail {
    visibility: visible;
  }
}

@media only screen and (max-width: 750px) {
  .sidebar {
    width: 100%;
    height: auto;
    overflow: visible;
  }

  .summary {
    visibility: collapse;
  }
}
</style>
