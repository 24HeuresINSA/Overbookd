<template>
  <div class="user-card">
    <ProfilePictureDialog />
    <v-card>
      <v-card-title class="presentation">
        <div class="presentation__picture">
          <ProfilePicture :user="me" class="profilePicture" />
          <v-btn text @click="openProfilePictureDialog">
            📸 {{ me.profilePicture ? `Changer` : `Ajouter` }}
          </v-btn>
        </div>
        <v-form class="presentation__name">
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
      </v-card-title>
      <v-card-text class="further-info">
        <div class="further-info__teams-and-stats">
          <div>
            <div class="teams">
              <TeamChip
                v-for="team of me.teams"
                :key="team"
                :team="team"
                with-name
              ></TeamChip>
            </div>
            <p>
              <v-icon>mdi-emoticon-cool-outline</v-icon>
              {{ me.charisma || 0 }} points de charisme
            </p>
            <p><v-icon>mdi-account-multiple</v-icon> {{ friends }} amis</p>
            <p>
              <v-icon>mdi-account-hard-hat</v-icon>
              {{ me.tasksCount }} tâches affectées
            </p>
          </div>
        </div>

        <v-form class="further-info__personal">
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
            readonly
            hint="Pour changer ton email il faut passer par les responsables bénévoles ou le.a sécretaire général.e. 🙏"
            persistent-hint
            @input="defectSave"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-text class="comment-friends">
        <CommentField v-model="comment" @update:comment="defectSave" />
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
import { MyUserInformationWithProfilePicture } from "~/utils/models/user.model";
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

interface UserCardData extends InputRulesData {
  firstname: string;
  lastname: string;
  nickname?: string | null;
  birthday: string;
  phone: string;
  comment?: string | null;
  email: string;
  delay?: ReturnType<typeof setTimeout>;
}

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
    friends(): number {
      return this.$accessor.user.mFriends.length;
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
    me(me: MyUserInformationWithProfilePicture) {
      this.fillLocalFields(me);
    },
  },

  mounted() {
    this.fillLocalFields(this.me);
    if (!this.me.profilePicture) return;
    this.$accessor.user.setMyProfilePicture();
  },

  methods: {
    openProfilePictureDialog() {
      this.$store.dispatch("dialog/openDialog", "profilePicture");
    },
    fillLocalFields({
      firstname,
      lastname,
      nickname,
      birthdate,
      email,
      phone,
      comment,
    }: MyUserInformationWithProfilePicture) {
      this.firstname = firstname;
      this.lastname = lastname;
      this.nickname = nickname;
      this.birthday = formatLocalDate(birthdate);
      this.email = email;
      this.phone = phone;
      this.comment = comment;
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
  },
});
</script>

<style scoped lang="scss">
.user-card {
  .presentation {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    @media only screen and (min-width: $mobile-max-width) {
      flex-direction: row;
    }
    &__picture {
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
    &__name {
      display: flex;
      flex-direction: column;
      align-content: center;
      justify-content: center;
      width: 100%;
      @media only screen and (min-width: $mobile-max-width) {
        width: 50%;
      }
    }
  }
  .further-info {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    @media only screen and (min-width: $mobile-max-width) {
      flex-direction: row;
    }
    gap: 10px;
    padding-bottom: 0px;

    &__teams-and-stats {
      display: flex;
      flex-direction: column;
      align-items: center;
      @media only screen and (min-width: $mobile-max-width) {
        width: 50%;
      }
    }

    &__personal {
      width: 100%;
      @media only screen and (min-width: $mobile-max-width) {
        width: 50%;
      }
    }

    .teams {
      margin-bottom: 10px;
    }
  }
  .comment-friends {
    display: flex;
    gap: 10px;
    flex-direction: column;
    @media only screen and (min-width: $mobile-max-width) {
      flex-direction: row;
    }

    .comment,
    #friends {
      width: 100%;
      padding: 0px 16px;
    }
  }
}
.profilePicture {
  border-radius: 50%;
  max-width: 100px;
  max-height: 100px;
}
</style>
