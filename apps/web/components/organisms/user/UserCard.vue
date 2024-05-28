<template>
  <div class="user-card">
    <ProfilePictureDialog />
    <v-card>
      <v-card-text class="user-card__content">
        <div class="picture">
          <ProfilePicture :user="me" class="profilePicture" />
          <v-btn text @click="openProfilePictureDialog">
            📸 {{ me.profilePicture ? `Changer` : `Ajouter` }}
          </v-btn>
        </div>
        <v-form class="identity">
          <v-text-field
            v-model="firstname"
            prepend-icon="mdi-account"
            label="Prénom"
            required
            :rules="[rules.required]"
            @input="defectSave"
          ></v-text-field>
          <v-text-field
            v-model="lastname"
            prepend-icon="mdi-account"
            label="Nom"
            required
            :rules="[rules.required]"
            @input="defectSave"
          ></v-text-field>
          <v-text-field
            v-model="nickname"
            prepend-icon="mdi-account"
            label="Surnom"
            hide-details
            clearable
            @click:clear()="nickname = null"
            @input="defectSave"
          ></v-text-field>
        </v-form>
        <div class="team-and-stats">
          <div class="teams">
            <TeamChip
              v-for="team of me.teams"
              :key="team"
              :team="team"
              with-name
            ></TeamChip>
          </div>
          <p>
            <v-icon>{{ charismaIcon }}</v-icon>
            {{ me.charisma || 0 }} points de charisme
          </p>
          <p><v-icon>mdi-account-multiple</v-icon> {{ friends }} amis</p>
          <p>
            <v-icon>mdi-account-hard-hat</v-icon>
            {{ me.tasksCount }} tâches affectées
          </p>
          <v-card class="planning-preference elevation-1" outlined>
            <v-btn-toggle
              :value="preferences?.paperPlanning"
              color="primary"
              group
              :mandatory="hasFilledPreferences"
              @change="updatePaperPlanningPreference"
            >
              <v-btn :value="true"> <strong>OUI</strong> </v-btn>
              <v-btn :value="false"> <strong>NON</strong> </v-btn>
            </v-btn-toggle>
            <p class="planning-preference__label">
              Je souhaite avoir une version imprimée de mon planning
            </p>
          </v-card>
        </div>
        <v-form class="personal-information">
          <v-text-field
            v-model="phone"
            prepend-icon="mdi-phone"
            label="Téléphone portable"
            required
            :rules="[rules.required, rules.mobilePhone]"
            @input="defectSave"
          ></v-text-field>
          <v-text-field
            v-model="birthday"
            prepend-icon="mdi-cake-variant"
            label="Date de naissance*"
            type="date"
            :rules="[
              rules.required,
              rules.birthdayMaxDate,
              rules.birthdayMinDate,
            ]"
            @input="defectSave"
          ></v-text-field>
          <v-text-field
            v-model="email"
            prepend-icon="mdi-email-outline"
            label="Email"
            name="email"
            autocomplete="email"
            inputmode="email"
            readonly
            hint="Pour changer ton email il faut passer par les responsables bénévoles ou le.a secrétaire général.e. 🙏"
            persistent-hint
            @input="defectSave"
          ></v-text-field>
        </v-form>
        <CommentField
          v-model="comment"
          class="comment"
          @update:comment="defectSave"
        />
        <FriendsCard id="friends" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import ProfilePictureDialog from "~/components/molecules/user/ProfilePictureDialog.vue";
import ProfilePicture from "~/components/atoms/card/ProfilePicture.vue";
import {
  InputRulesData,
  isMobilePhoneNumber,
  maxDate,
  minDate,
  required,
} from "~/utils/rules/input.rules";
import { formatLocalDate } from "~/utils/date/date.utils";
import FriendsCard from "~/components/molecules/friend/FriendsCard.vue";
import CommentField from "~/components/atoms/field/comment/CommentField.vue";
import { EVIL, EVIL_CHARISMA, COOL } from "~/utils/easter-egg/evil-charisma";
import { Preference } from "@overbookd/http";
import { MyUserInformationWithProfilePicture } from "~/utils/user/user-information";

type UserCardData = InputRulesData & {
  firstname: string;
  lastname: string;
  nickname?: string | null;
  birthday: string;
  phone: string;
  comment?: string | null;
  email: string;
  delay?: ReturnType<typeof setTimeout>;
};

export default defineComponent({
  name: "UserCard",
  components: {
    TeamChip,
    ProfilePictureDialog,
    ProfilePicture,
    FriendsCard,
    CommentField,
  },
  data(): UserCardData {
    return {
      firstname: "",
      lastname: "",
      nickname: null,
      birthday: "2000-01-01",
      email: "",
      phone: "",
      comment: null,
      delay: undefined,
      rules: {
        required: required,
        birthdayMinDate: minDate(new Date("1950-01-01")),
        birthdayMaxDate: maxDate(),
        mobilePhone: isMobilePhoneNumber,
      },
    };
  },

  computed: {
    me(): MyUserInformationWithProfilePicture {
      return this.$accessor.user.me;
    },
    myId(): number {
      return this.me.id;
    },
    friends(): number {
      return this.$accessor.user.mFriends.length;
    },
    preferences(): Preference | null {
      return this.$accessor.preference.myPreferences;
    },
    hasFilledPreferences(): boolean {
      return (
        this.preferences?.paperPlanning !== undefined &&
        this.preferences?.paperPlanning !== null
      );
    },
    charismaIcon(): string {
      return this.me.charisma === EVIL_CHARISMA ? EVIL.icon : COOL.icon;
    },
    isValid(): boolean {
      const isValidFirstname = this.rules.required(this.firstname) === true;
      const isValidLastname = this.rules.required(this.lastname) === true;
      const isValidBirthdate = [
        this.rules.required(this.birthday),
        this.rules.birthdayMinDate(this.birthday),
        this.rules.birthdayMaxDate(this.birthday),
      ].every((rule) => rule === true);
      const isValidPhone = [
        this.rules.required(this.phone),
        this.rules.mobilePhone(this.phone),
      ].every((rule) => rule === true);

      return (
        isValidFirstname && isValidLastname && isValidBirthdate && isValidPhone
      );
    },
  },

  watch: {
    async myId() {
      await this.fetchMyData();
      this.fillLocalFields();
    },
  },

  async mounted() {
    await this.fetchMyData();
    this.fillLocalFields();
    if (!this.me.profilePicture) return;
  },

  methods: {
    async fetchMyData() {
      await Promise.all([
        this.$accessor.user.setMyProfilePicture(),
        this.$accessor.user.fetchMyFriends(),
        this.$accessor.preference.fetchMyPreferences(),
      ]);
    },
    openProfilePictureDialog() {
      this.$store.dispatch("dialog/openDialog", "profilePicture");
    },
    fillLocalFields() {
      this.firstname = this.me.firstname;
      this.lastname = this.me.lastname;
      this.nickname = this.me.nickname;
      this.birthday = formatLocalDate(this.me.birthdate);
      this.email = this.me.email;
      this.phone = this.me.phone;
      this.comment = this.me.comment;
    },
    defectSave() {
      if (this.delay) clearInterval(this.delay);
      if (!this.isValid) return;
      this.delay = setTimeout(this.save, 800);
    },
    save() {
      const nickname = this.nickname ? this.nickname : null;
      const comment = this.comment ? this.comment : null;
      const myInfo = {
        firstname: this.firstname,
        lastname: this.lastname,
        nickname,
        birthdate: new Date(this.birthday),
        email: this.email,
        phone: this.phone,
        comment,
      };
      this.$accessor.user.updateMyProfile(myInfo);
    },
    updatePaperPlanningPreference(paperPlanning?: boolean) {
      if (paperPlanning === undefined) return;
      this.$accessor.preference.updateMyPreferences({ paperPlanning });
    },
  },
});
</script>

<style scoped lang="scss">
.user-card {
  &__content {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    column-gap: 10px;
    row-gap: 15px;
    > * {
      justify-self: center;
      align-self: center;
    }
    .picture {
      grid-column: 1 / span 1;
      grid-row: 1 / span 1;
    }
    .identity {
      grid-column: 3 / span 1;
      grid-row: 1 / span 1;
    }
    .team-and-stats {
      grid-column: 2 / span 1;
      grid-row-start: 1 / span 1;
      .teams {
        margin-bottom: 16px;
      }
    }
    .personal-information {
      grid-column: 3 / span 1;
      grid-row: 2 / span 1;
    }
    .comment {
      grid-column: 1 / span 2;
      grid-row: 2 / span 1;
    }
    #friends {
      grid-column: 1 / span 3;
      grid-row: 3 / span 1;
      min-width: 100%;
    }
    @media only screen and (max-width: $mobile-max-width) {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      gap: 10px;
      > * {
        align-self: unset;
      }
    }
    form {
      min-width: 100%;
    }
    .picture {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      align-content: center;
      gap: 2px;
      @media only screen and (min-width: $mobile-max-width) {
        width: 50%;
      }
    }
  }
}
.profilePicture {
  border-radius: 50%;
  max-width: 100px;
  max-height: 100px;
  margin-bottom: 15px;
}
.planning-preference {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  &__label {
    margin-bottom: 0;
  }
}
</style>
