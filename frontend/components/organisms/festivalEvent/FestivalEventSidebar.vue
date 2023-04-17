<template>
  <div class="sidebar fa ft">
    <h1>{{ titleWithId }}</h1>
    <h2>{{ name }}</h2>
    <div id="status">
      <span id="dot" :class="status"></span>
      <h3>{{ statusLabel }}</h3>
    </div>
    <div class="icons">
      <div v-for="validator of validators" :key="validator.code" class="icon">
        <v-icon :class="getValidatorStatus(validator)" size="26">
          {{ validator.icon }}
        </v-icon>
        <span class="icon-detail">{{ validator.name }}</span>
      </div>
    </div>
    <FestivalEventSummary class="summary" festival-event="FT" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { getFAValidationStatus } from "~/utils/festivalEvent/faUtils";
import { getFTValidationStatus } from "~/utils/festivalEvent/ftUtils";
import { FA, FAStatusLabel } from "~/utils/models/FA";
import { FT, FTStatusLabel } from "~/utils/models/ft";
import { Team } from "~/utils/models/team";
import FestivalEventSummary from "./FestivalEventSummary.vue";

export default Vue.extend({
  name: "FestivalEventSidebar",
  components: { FestivalEventSummary },
  props: {
    festivalEvent: {
      type: String,
      default: () => "FA",
    },
  },
  computed: {
    mFA(): FA {
      return this.$accessor.FA.mFA;
    },
    mFT(): FT {
      return this.$accessor.FT.mFT;
    },
    isFA(): boolean {
      return this.festivalEvent === "FA";
    },
    titleWithId(): string {
      if (this.isFA) return `Fiche Activité n°${this.$route.params.fa}`;
      return `Fiche Tâche n°${this.$route.params.ft}`;
    },
    name(): string {
      return this.isFA ? this.mFA.name : this.mFT.name;
    },
    // TODO : Crée un StatusLabel commun (dans un nouveau model Status ?)
    statusLabel(): FAStatusLabel | FTStatusLabel {
      if (this.isFA) return FAStatusLabel[this.mFA.status];
      return FTStatusLabel[this.mFT.status];
    },
    validators(): Team[] {
      if (this.isFA) return this.$accessor.team.faValidators;
      return this.$accessor.team.ftValidators;
    },
    status(): string {
      if (this.isFA) return this.mFA.status.toLowerCase();
      return this.mFT.status.toLowerCase();
    },
  },
  methods: {
    getValidatorStatus(validator: Team) {
      if (this.isFA) {
        return getFAValidationStatus(this.mFA, validator.code).toLowerCase();
      }
      return getFTValidationStatus(this.mFT, validator.code).toLowerCase();
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

  #status {
    display: flex;
    align-items: center;

    #dot {
      height: 25px;
      width: 25px;
      border-radius: 50%;
      display: inline-block;
      margin-left: 16px;
      margin-right: 10px;
    }
  }

  .icons {
    display: flex;
    margin: 20px 5px 15px 16px;

    .icon {
      position: relative;
      display: inline-block;
      margin-right: 20px;

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
