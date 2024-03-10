<template>
  <div>
    <h1>Admission bénévoles</h1>
    <v-data-table
      :headers="headers"
      :items="volunteersToEnroll"
      :expanded.sync="displayedVolunteers"
      :items-per-page="30"
      show-expand
      @click:row="openOrCloseVolunteerDetails"
    >
      <template #item.registeredAt="{ item }">
        {{ formatDate(item.registeredAt) }}
      </template>

      <template #item.name="{ item }">
        {{ formatUserNameWithNickname(item) }}
      </template>

      <template #item.teams="{ item }">
        <TeamChip v-for="team of item.teams" :key="team" :team="team" />
      </template>

      <template #item.action="{ item }">
        <v-btn color="success" small @click="enroll(item)">
          <v-icon left> mdi-check </v-icon>
          Enrôler
        </v-btn>
      </template>

      <template #expanded-item="{ item }">
        <td :colspan="headers.length">
          <div class="volunteer-details">
            <div class="picture-and-comment">
              <v-icon class="defaultProfilePicture">
                mdi-account-circle
              </v-icon>
              <v-textarea
                :value="item.comment"
                class="comment-input"
                label="Commentaire"
                rows="20"
                readonly
              ></v-textarea>
            </div>
            <div class="contact-and-availabilities">
              <div class="contact">
                <span class="phone">
                  <v-btn icon :href="formatPhoneLink(item.mobilePhone)">
                    <v-icon>mdi-phone</v-icon>
                  </v-btn>
                  <v-text-field
                    v-model="item.mobilePhone"
                    label="Téléphone portable"
                    readonly
                  ></v-text-field>
                </span>
                <span class="email">
                  <v-btn icon :href="formatEmailLink(item.email)">
                    <v-icon>mdi-email-outline</v-icon>
                  </v-btn>
                  <v-text-field
                    v-model="item.email"
                    label="Email"
                    readonly
                  ></v-text-field>
                </span>
              </div>
              <AvailabilitiesSumupV2
                :readonly="false"
                :availabilities="castToPeriods(item.availabilities)"
                @update:availabilities="
                  (availabilities) =>
                    updateVolunteerAvailabilities(item.id, availabilities)
                "
              />
            </div>
          </div>
        </td>
      </template>
    </v-data-table>
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { EnrollableVolunteer } from "@overbookd/http";
import { removeItemAtIndex } from "@overbookd/list";
import { IProvidePeriod, Period } from "@overbookd/period";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { formatLocalDate } from "~/utils/date/date.utils";
import { Header } from "~/utils/models/data-table.model";
import {
  formatPhoneLink,
  formatUserNameWithNickname,
  formatEmailLink,
} from "~/utils/user/user.utils";
import AvailabilitiesSumupV2 from "~/components/molecules/availabilities/AvailabilitiesSumupV2.vue";

type RegistrationsData = {
  headers: Header[];
  displayedVolunteers: EnrollableVolunteer[];
};

export default defineComponent({
  name: "RegistrationsSoft",
  components: { SnackNotificationContainer, TeamChip, AvailabilitiesSumupV2 },
  data: (): RegistrationsData => ({
    headers: [
      { text: "Inscription", value: "registeredAt" },
      { text: "Nom", value: "name" },
      { text: "Charisme", value: "charisma" },
      { text: "Équipes", value: "teams", sortable: false },
      { text: "Action", value: "action", sortable: false },
      { text: "", value: "data-table-expand", sortable: false },
    ],
    displayedVolunteers: [],
  }),
  computed: {
    volunteersToEnroll(): EnrollableVolunteer[] {
      return this.$accessor.registration.volunteers;
    },
  },
  mounted() {
    this.$accessor.registration.getVolunteers();
  },
  methods: {
    formatDate(date: Date): string {
      return formatLocalDate(date);
    },
    openOrCloseVolunteerDetails(volunteer: EnrollableVolunteer) {
      const volunteerIndex = this.displayedVolunteers.findIndex(
        ({ id }) => id === volunteer.id,
      );
      const dontDisplayDetailsYet = volunteerIndex === -1;
      if (dontDisplayDetailsYet) {
        this.displayedVolunteers = [...this.displayedVolunteers, volunteer];
        return;
      }
      this.displayedVolunteers = removeItemAtIndex(
        this.displayedVolunteers,
        volunteerIndex,
      );
    },
    castToPeriods(periodProviders: IProvidePeriod[]): Period[] {
      return periodProviders.map((period) => Period.init(period));
    },
    enroll(volunteer: EnrollableVolunteer) {
      this.$accessor.registration.enrollNewVolunteers([volunteer]);
    },
    async updateVolunteerAvailabilities(
      volunteerId: EnrollableVolunteer["id"],
      availabilities: Period[],
    ) {
      await this.$accessor.volunteerAvailability.overrideVolunteerAvailabilities(
        {
          volunteerId,
          availabilities,
        },
      );
      this.$accessor.registration.fetchVolunteerInformation(volunteerId);
    },
    formatPhoneLink,
    formatEmailLink,
    formatUserNameWithNickname,
  },
});
</script>

<style lang="scss" scoped>
.defaultProfilePicture {
  font-size: 150px;
  align-self: center;
  &.small {
    font-size: 55px;
    @media only screen and (max-width: $mobile-max-width) {
      font-size: 45px;
    }
  }
}

.volunteer-details {
  min-width: 100%;
  margin: 15px 0px;
  display: flex;
  gap: 15px;
  .picture-and-comment {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .contact-and-availabilities {
    flex-grow: 5;
    display: flex;
    flex-direction: column;
    gap: 10px;
    .contact {
      display: flex;
      gap: 10px;
      justify-content: space-evenly;
      .phone,
      .email {
        display: flex;
        gap: 5px;
        align-items: baseline;
        min-width: 40%;
      }
    }
  }
}
</style>
