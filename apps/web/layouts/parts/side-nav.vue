<template>
  <aside>
    <nav>
      <nuxt-link
        v-for="page in pages"
        :key="page.title"
        :to="page.to"
        class="page"
      >
        <v-icon>{{ page.icon }}</v-icon>
        <span class="page__title">{{ page.title }}</span>
      </nuxt-link>
    </nav>
    <div class="actions">
      <span class="action bug-report" @click="() => (reportBug = true)">
        <v-icon>mdi-bug</v-icon>
        <span class="action__title">Rapporter une erreur</span>
      </span>
      <span class="action ask-help" @click="() => (askQuestion = true)">
        <v-icon>mdi-help-circle-outline</v-icon>
        <span class="action__title">Une question ?</span>
      </span>
    </div>
    <v-dialog v-model="askQuestion" max-width="800">
      <v-card>
        <v-card-title>Demander de l'aide</v-card-title>
        <v-card-text>
          <h4>
            Si tu as un problème ou que tu te poses une question, contacte par
            mail les responsables bénévoles. <br />
            Nous nous en occuperons au plus vite.
          </h4>
        </v-card-text>
        <v-card-actions>
          <v-btn :href="`mailto:humains@24heures.org`"> Envoyer un mail </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="reportBug" max-width="800px">
      <BugReport />
    </v-dialog>
  </aside>
</template>

<script lang="ts">
import Vue from "vue";
import BugReport from "~/components/atoms/card/BugReport.vue";
import { isDesktop } from "~/utils/device/device.utils";
import { Page, pages } from "~/utils/pages/pages-list";

export default Vue.extend({
  name: "SideNav",
  components: {
    BugReport,
  },
  data: () => ({
    askQuestion: false,
    reportBug: false,
  }),
  computed: {
    pages(): Page[] {
      return pages.filter(({ permission, mobileSupport }) => {
        const isSupportedByDevice = isDesktop() || mobileSupport;
        const hasAccess = this.$accessor.user.can(permission);

        return isSupportedByDevice && hasAccess;
      });
    },
  },
});
</script>

<style scoped lang="scss">
$background-color: $blue-24h;

aside {
  position: sticky;
  @media only screen and (max-width: $mobile-max-width) {
    position: fixed;
    z-index: 3;
    width: 100%;
    .actions {
      border-left: 2px solid #756a46;
      display: flex;
    }
    .v-icon {
      font-size: 36px;
    }
  }
  bottom: 0;
  @media only screen and (max-width: $mobile-max-width) {
    flex-direction: row;
  }
  background-color: $background-color;
  min-width: 35px;
  padding: 5px 0px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &:hover {
    min-width: 200px;
    .page__title,
    .action__title {
      display: unset;
    }
  }

  .action,
  .page {
    padding: 5px;
    &:hover {
      cursor: pointer;
      background-color: change-color(
        $color: $background-color,
        $whiteness: 60%
      );
    }
    display: flex;
    gap: 3px;
    &__title {
      display: none;
    }
  }

  nav {
    a {
      text-decoration: none;
      color: black;
    }
    display: flex;
    flex-direction: column;
    @media only screen and (max-width: $mobile-max-width) {
      flex-direction: row;
      max-width: 80%;
      overflow-x: scroll;
      overflow-y: hidden;
    }
  }
}
</style>
