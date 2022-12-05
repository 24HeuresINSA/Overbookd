<template>
  <div class="main">
    <div class="sidebar">
      <h1>Fiche Activité n°{{ faId }}</h1>

      <div class="status">
        <span
          class="dot"
          :class="
            mFA.status === 'SUBMITTED'
              ? 'orange'
              : mFA.status === 'REFUSED'
              ? 'red'
              : mFA.status === 'VALIDATED'
              ? 'green'
              : 'grey'
          "
        ></span>
        <h3>
          {{
            mFA.status ? statusTrad.get(mFA.status.toUpperCase()) : "Brouillon"
          }}
        </h3>
      </div>

      <div class="icons">
        <div v-for="validator of validators" :key="validator.code" class="icon">
          <v-icon :color="getIconColor(validator)" size="26">
            {{ validator.icon }}
          </v-icon>
          <span class="icon-detail">{{ validator.name }}</span>
        </div>
      </div>
      <FormSummary class="summary"></FormSummary>
    </div>
    <v-container class="container">
      <FAGeneralCard id="general" :is-disabled="isDisabled"></FAGeneralCard>
      <FADetailCard
        id="detail"
        :is-disabled="isDisabled && !me.team.includes('humain')"
      ></FADetailCard>
      <SignaCard id="signa" :is-disabled="isDisabled"></SignaCard>
      <TimeframeTable id="timeframe" :is-disabled="isDisabled"></TimeframeTable>
      <SecurityCard id="security" :is-disabled="isDisabled"></SecurityCard>
      <CollaboratorCard
        id="presta"
        :is-disabled="isDisabled"
      ></CollaboratorCard>
      <h2 id="log" class="log-text">Logistique 🚚</h2>
      <h4 class="log-text">
        S'il manque des informations, ou du matos veuillez contacter le
        responsable de la logistique sur
        <a href="mailto:logistique@24heures.org">logistique@24heures.org</a>
      </h4>
      <LogisticsCard
        title="Matos"
        owner="matos"
        :types="Object.values({})"
        :is-disabled="isDisabled"
      ></LogisticsCard>

      <LogisticsCard
        title="Barrières"
        owner="barrieres"
        :types="Object.values({})"
        :is-disabled="isDisabled"
      ></LogisticsCard>
      <LogisticsCard
        title="Matos Elec / Eau"
        owner="elec"
        :types="Object.values({})"
        :is-disabled="isDisabled"
      ></LogisticsCard>
      <ElecLogisticCard id="elec" :is-disabled="isDisabled"></ElecLogisticCard>
      <WaterLogisticCard
        id="water"
        :is-disabled="isDisabled"
      ></WaterLogisticCard>
      <CommentCard id="comment"></CommentCard>
      <!-- <FTCard id="ft"></FTCard> -->
    </v-container>
    <SnackNotificationContainer />

    <div class="bottom-bar">
      <v-btn
        v-if="mFA.id > 1"
        class="bottom-bar__navigation"
        small
        fab
        :to="`/fa/${mFA.id - 1}`"
      >
        <v-icon small>mdi-arrow-left</v-icon>
      </v-btn>
      <div class="bottom-bar__actions">
        <v-btn
          v-if="mValidators.length === 1"
          color="red"
          @click="refuseDialog = true"
          >refusé par {{ mValidators[0].name }}
        </v-btn>
        <v-menu v-if="mValidators.length > 1" offset-y>
          <template #activator="{ attrs, on }">
            <v-btn class="white--text" v-bind="attrs" color="red" v-on="on">
              Refuser
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="validator of mValidators"
              :key="validator.id"
              link
            >
              <v-list-item-title
                @click="refuseDialog = true"
                v-text="validator.name"
              ></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn
          v-if="mValidators.length === 1"
          color="green"
          @click="validate(mValidators[0])"
          >validé par {{ mValidators[0].name }}
        </v-btn>
        <v-menu v-if="mValidators.length > 1" offset-y>
          <template #activator="{ attrs, on }">
            <v-btn class="white--text" v-bind="attrs" color="green" v-on="on">
              valider
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="validator of mValidators"
              :key="validator.id"
              link
            >
              <v-list-item-title
                color="green"
                @click="validate(validator)"
                v-text="validator.name"
              ></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-btn
          v-if="mFA.status && mFA.status !== 'SUBMITTED'"
          color="warning"
          @click="validationDialog = true"
          >soumettre à validation
        </v-btn>
        <v-btn @click="saveFA">sauvegarder</v-btn>
        <v-btn
          v-if="mValidators.length >= 1 && mFA.isValid === false"
          color="red"
          @click="undelete"
          >récupérer
        </v-btn>
      </div>
      <v-btn class="bottom-bar__navigation" small fab :to="`/fa/${mFA.id + 1}`">
        <v-icon small>mdi-arrow-right</v-icon>
      </v-btn>
    </div>

    <v-dialog v-model="validationDialog" width="500">
      <v-card>
        <v-img
          height="620"
          src="https://media.discordapp.net/attachments/726537148119122023/806793684598128640/WhatsApp_Image_2021-02-03_at_23.36.35.jpeg"
        ></v-img>
        <v-card-title> ⚠️ Warning ⚠️ </v-card-title>
        <v-card-text> T'es sur de ta merde la ? </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="submit">soumettre</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="refuseDialog" max-width="600px">
      <v-card>
        <v-card-title> Refuser </v-card-title>
        <v-card-text>
          <h4>pourquoi c'est de la 💩</h4>
          <p>sans trop de 🧂</p>
          <v-textarea v-model="refuseComment" required></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="refuse(mValidators[0])">
            enregistrer</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TimeframeTable from "~/components/organisms/form/fa/TimeframeTable.vue";
import { RepoFactory } from "~/repositories/repoFactory";
import LogisticsCard from "~/components/organisms/form/LogisticsCard.vue";
import CommentCard from "~/components/organisms/form/CommentCard.vue";
import ElecLogisticCard from "~/components/organisms/form/fa/ElecLogisticCard.vue";
import CollaboratorCard from "~/components/organisms/form/fa/CollaboratorCard.vue";
import WaterLogisticCard from "~/components/organisms/form/fa/WaterLogisticCard.vue";
import FAGeneralCard from "~/components/organisms/form/fa/FAGeneralCard.vue";
import FADetailCard from "~/components/organisms/form/fa/FADetailCard.vue";
import SecurityCard from "~/components/organisms/form/fa/SecurityCard.vue";
import FormSummary from "~/components/organisms/form/FormSummary.vue";
import SignaCard from "~/components/organisms/form/fa/SignaCard.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import { team } from "~/utils/models/repo";

export default Vue.extend({
  name: "Fa",
  components: {
    ElecLogisticCard,
    CommentCard,
    SignaCard,
    LogisticsCard,
    TimeframeTable,
    CollaboratorCard,
    WaterLogisticCard,
    FAGeneralCard,
    FADetailCard,
    SecurityCard,
    FormSummary,
    SnackNotificationContainer,
  },

  data: () => ({
    validationDialog: false,
    refuseDialog: false,
    refuseComment: "",

    faRepo: RepoFactory.faRepo,

    statusTrad: new Map<string, string>([
      ["DRAFT", "Brouillon"],
      ["SUBMITTED", "Soumise à validation"],
      ["REFUSED", "Refusée"],
      ["VALIDATED", "Validée"],
    ]),
    color: {
      submitted: "grey",
      validated: "green",
      refused: "red",
    },
  }),

  computed: {
    FA(): any {
      return this.$accessor.FA;
    },
    mFA(): any {
      return this.$accessor.FA.mFA;
    },
    me(): any {
      return this.$accessor.user.me;
    },
    faId(): number {
      return +this.$route.params.fa;
    },
    validators(): Array<any> {
      return this.$accessor.team.faValidators;
    },
    mValidators(): Array<any> {
      let mValidator: Array<any> = [];
      if (this.me.team.includes("admin")) {
        // admin has all the validators powers
        return this.validators;
      }
      if (this.validators) {
        this.validators.forEach((validator: any) => {
          if (this.me.team && this.me.team.includes(validator.name)) {
            mValidator.push(validator);
          }
        });
        return mValidator;
      }
      return [];
    },
    isDisabled(): boolean {
      return (
        (this.mFA.status === "SUBMITTED" || this.mFA.status === "VALIDATED") &&
        !this.me.team.includes("admin")
      );
    },
  },

  async mounted() {
    const res = await this.$accessor.FA.getAndSet(this.faId);
    if (!res) {
      alert("Oups 😬 J'ai l'impression que cette FA n'existe pas...");
      await this.$router.push({
        path: "/fa",
      });
    }

    let title = "FA " + this.faId;
    if (this.mFA.name) title += " - " + this.mFA.name;
    document.title = title;
  },
  methods: {
    async saveFA() {
      await this.$accessor.FA.save();
      await this.$store.dispatch("notif/pushNotification", {
        type: "success",
        message: "✅ FA sauvegardée !",
      });
    },

    async undelete() {
      await this.mFA.undelete();
      /*
      await safeCall(
        this.$store,
        this.faRepo.updateFA(this, this.mFA.id, this.mFA),
        "undelete"
      );*/
    },

    async validate(validator: team) {
      if (validator) {
        const payload = {
          validator_id: validator.id,
          user_id: this.$accessor.user.me.id,
          team_name: validator.name,
        };
        await this.$accessor.FA.validate(payload);
      }
    },

    async refuse(validator: team) {
      const payload = {
        validator_id: validator.id,
        user_id: this.$accessor.user.me.id,
        message: this.refuseComment,
      };
      await this.$accessor.FA.refuse(payload);
      this.refuseComment = "";
      this.refuseDialog = false;
    },

    submit() {
      this.$accessor.FA.submitForReview({
        faId: this.faId,
        authorId: this.me.id,
        authorName: this.me.firstname + " " + this.me.lastname,
      });
      this.validationDialog = false;
      this.saveFA();
    },

    getIconColor(validator: team) {
      let color = "grey";
      if (this.FA.mFA.fa_validation) {
        this.FA.mFA.fa_validation.forEach((validation: any) => {
          if (Number(validation.Team.id) === Number(validator.id)) {
            color = "green";
          }
        });
      }
      if (this.FA.mFA.fa_refuse) {
        this.FA.mFA.fa_refuse.forEach((validation: any) => {
          if (Number(validation.Team.id) === Number(validator.id)) {
            color = "red";
          }
        });
      }
      return color;
    },
  },
});
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  height: calc(100vh - 42px);
}

.sidebar {
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  overflow: auto;
  padding-right: 20px;
  width: 300px;
}

h1 {
  font-size: 30px;
  margin: 16px;
}

.dot {
  height: 25px;
  width: 25px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  margin-left: 16px;
  margin-right: 10px;
}

.status {
  display: flex;
  align-items: center;
}

.icons {
  display: flex;
  justify-content: space-between;
  margin: 20px 5px 15px 16px;
}

.icons .icon {
  position: relative;
  display: inline-block;
}

.icons .icon .icon-detail {
  visibility: hidden;
  width: 60px;
  font-size: 15px;
  text-align: center;
  border-radius: 6px;
  user-select: none;

  position: absolute;
  z-index: 1;
  top: 100%;
  left: 50%;
  margin-left: -30px;
}

.icon:hover .icon-detail {
  visibility: visible;
}

.container {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  overflow: auto;
  scroll-behavior: smooth;
  padding-bottom: 50px;
  > * {
    margin-bottom: 30px;
    &:last-child {
      margin-bottom: 0px;
    }
  }
}

.log-text {
  margin-bottom: 8px;
}

.bottom-bar {
  position: fixed;
  right: 5%;
  bottom: 42px;
  z-index: 3;
  display: flex;
  gap: 30px;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  &__actions {
    display: flex;
    align-items: center;
    justify-content: space-around;
    gap: 10px;
  }
}

.grey {
  background-color: grey;
}
.orange {
  background-color: orange;
}

.red {
  background-color: red;
}

.green {
  background-color: greenyellow;
}

@media only screen and (max-width: 965px) {
  .bottom-bar {
    position: fixed;
    bottom: 42px;
    &__actions {
      flex-direction: column;
    }
  }
  .container {
    padding-bottom: 200px;
  }
}

@media only screen and (max-width: 750px) {
  .main {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    overflow: visible;
  }

  .summary {
    visibility: collapse;
  }

  .container {
    overflow: visible;
  }
}
</style>
