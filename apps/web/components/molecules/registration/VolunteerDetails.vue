<template>
  <div class="volunteer-details">
    <div class="picture-and-comment">
      <v-icon class="defaultProfilePicture"> mdi-account-circle </v-icon>
      <v-textarea
        :value="volunteer.comment"
        class="comment-input"
        label="Commentaire"
        rows="20"
        readonly
      ></v-textarea>
    </div>
    <div class="contact-and-availabilities">
      <div class="contact">
        <span class="phone">
          <v-btn icon :href="phoneLink">
            <v-icon>mdi-phone</v-icon>
          </v-btn>
          <v-text-field
            :value="volunteer.mobilePhone"
            label="Téléphone portable"
            readonly
          ></v-text-field>
        </span>
        <span class="email">
          <v-btn icon :href="emailLink">
            <v-icon>mdi-email-outline</v-icon>
          </v-btn>
          <v-text-field
            :value="volunteer.email"
            label="Email"
            inputmode="email"
            readonly
          ></v-text-field>
        </span>
      </div>
      <AvailabilitiesSumupV2
        :readonly="false"
        :availabilities="availabilities"
        @update:availabilities="updateVolunteerAvailabilities"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { EnrollableVolunteer } from "@overbookd/http";
import { Period } from "@overbookd/period";
import { formatPhoneLink, formatEmailLink } from "~/utils/user/user.utils";
import AvailabilitiesSumupV2 from "../availabilities/AvailabilitiesSumupV2.vue";

export default defineComponent({
  name: "VolunteerDetails",
  components: { AvailabilitiesSumupV2 },
  props: {
    volunteer: {
      type: Object as () => EnrollableVolunteer,
      required: true,
    },
  },
  emits: ["forget-him"],
  computed: {
    availabilities(): Period[] {
      return this.volunteer.availabilities.map((period) => Period.init(period));
    },
    emailLink(): string {
      return formatEmailLink(this.volunteer.email);
    },
    phoneLink(): string {
      return formatPhoneLink(this.volunteer.mobilePhone);
    },
  },
  methods: {
    async updateVolunteerAvailabilities(availabilities: Period[]) {
      const volunteerId = this.volunteer.id;
      await this.$accessor.volunteerAvailability.overrideVolunteerAvailabilities(
        {
          volunteerId,
          availabilities,
        },
      );
      this.$accessor.registration.fetchVolunteerInformation(volunteerId);
    },
  },
});
</script>

<style lang="scss" scoped>
.volunteer-details {
  min-width: 100%;
  margin: 15px 0px;
  display: flex;
  gap: 15px;

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
