<template>
  <div class="sidebar fa ft">
    <h1 id="title">{{ titleWithId }}</h1>
    <h2 id="name">{{ name }}</h2>
    <div id="status">
      <span id="dot" :class="status" />
      <h3>{{ statusLabel }}</h3>
    </div>
    <div class="icons">
      <div v-for="reviewer of reviewers" :key="reviewer.code" class="icon">
        <v-icon :class="getReviewerStatus(reviewer)" size="22">
          {{ reviewer.icon }}
        </v-icon>
        <span class="icon-detail">{{ reviewer.name }}</span>
      </div>
    </div>
    <FestivalEventSummary class="summary" :festival-event="festivalEvent" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import FestivalEventSummary from "./FestivalEventSummary.vue";
import { getFTValidationStatus } from "~/utils/festival-event/ft.utils";
import {
  FaStatusLabel,
  faStatusLabels,
  BROUILLON as FA_BROUILLON,
  findFaReviewerStatus,
} from "~/utils/festival-event/festival-activity.model";
import {
  Ft,
  FtStatusLabel,
  ftStatusLabels,
  BROUILLON as FT_BROUILLON,
} from "~/utils/models/ft.model";
import { Team } from "~/utils/models/team.model";
import { FestivalActivity } from "@overbookd/festival-activity";

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
    mFA(): FestivalActivity {
      return this.$accessor.festivalActivity.selectedActivity;
    },
    mFT(): Ft {
      return this.$accessor.ft.mFT;
    },
    isFA(): boolean {
      return this.festivalEvent === "FA";
    },
    titleWithId(): string {
      return this.isFA
        ? `Fiche Activité n°${this.$route.params.faId}`
        : `Fiche Tâche n°${this.$route.params.ftId}`;
    },
    name(): string {
      return this.isFA ? this.mFA.general.name : this.mFT.name;
    },
    statusLabel(): FaStatusLabel | FtStatusLabel {
      return this.isFA
        ? faStatusLabels.get(this.mFA.status) ?? FA_BROUILLON
        : ftStatusLabels.get(this.mFT.status) ?? FT_BROUILLON;
    },
    reviewers(): Team[] {
      return this.isFA
        ? this.$accessor.team.faReviewers
        : this.$accessor.team.ftReviewers;
    },
    status(): string {
      return this.isFA
        ? this.mFA.status.toLowerCase()
        : this.mFT.status.toLowerCase();
    },
  },
  async mounted() {
    await this.$accessor.team.fetchFaReviewers();
  },
  methods: {
    getReviewerStatus(reviewer: Team): string {
      return this.isFA
        ? findFaReviewerStatus(this.mFA, reviewer.code).toLowerCase()
        : getFTValidationStatus(this.mFT, reviewer.code).toLowerCase();
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
  width: 320px;

  #title {
    font-size: 1.7rem;
    margin: 16px;
    margin-bottom: 4px;
  }

  #name {
    font-size: 1.2rem;
    font-weight: normal;
    color: rgb(89, 89, 89);
    margin: 16px;
    margin-top: 0;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: auto;
    display: block;
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

@media only screen and (max-width: $mobile-max-width) {
  .sidebar {
    width: 100%;
    height: fit-content;
    overflow: visible;
  }

  .summary {
    display: none;
  }
}
</style>
