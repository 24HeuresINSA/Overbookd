<template>
  <div>
    <v-container style="display: grid">
      <v-row justify="center" align="center">
        <v-col cols="12" sm="6" md="4">
          <v-card v-if="user" max-width="350px">
            <v-img
              v-if="user.pp"
              :src="getPPUrl() + 'api/user/pp/' + user.pp"
              max-width="600px"
              max-height="500px"
            ></v-img>
            <v-card-title
              >Bonsoir
              {{ user.nickname ? user.nickname : user.firstname }}
            </v-card-title>
            <v-card-subtitle
              >👋 {{ user.firstname }}.{{ user.lastname }}</v-card-subtitle
            >
            <v-card-text>
              <h3>📩 {{ user.email }}</h3>
              <h3>📞 +33 {{ user.phone }}</h3>
              <h3>😎 {{ user.charisma || 0 }} points de charisme</h3>
              <h3>❤️ {{ user.friends ? user.friends.length : 0 }} amis</h3>
              <h3>📆 {{ new Date(user.birthdate).toLocaleDateString() }}</h3>
              <h3>
                🗣 {{ user.assigned ? user.assigned.length : 0 }} tâches
                affectées
              </h3>
              <h3>🚗 {{ user.hasDriverLicense ? "✅" : "🛑" }}</h3>

              <OverChips :roles="user.team"></OverChips>

              <v-progress-linear :value="user.charisma"></v-progress-linear>
            </v-card-text>
            <v-card-actions>
              <v-btn text @click="isPPDialogOpen = true"
                >📸
                {{
                  user.pp
                    ? `Mettre à jour la photo de profil`
                    : `Ajouter une photo de profil`
                }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" sm="4" md="6">
          <v-card v-if="user">
            <v-card-title>Notifications 📣️</v-card-title>
            <v-card-text v-if="user.notifications">
              <v-simple-table>
                <template #default>
                  <thead>
                    <tr>
                      <th class="text-left"></th>
                      <th class="text-left">Team</th>
                      <th class="text-left">Message</th>
                      <th class="text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(notification, index) in user.notifications"
                      :key="index"
                    >
                      <td>
                        {{ getNotificationIcon(notification.type) }}
                      </td>
                      <td>
                        <OverChips :roles="notification.team"></OverChips>
                      </td>
                      <td>{{ notification.message }}</td>
                      <td v-if="notification.type === 'friendRequest'">
                        <v-btn icon @click="acceptFriendRequest(notification)">
                          <v-icon>mdi-account-check</v-icon>
                        </v-btn>
                        <v-btn icon @click="refuseFriendRequest(notification)">
                          <v-icon>mdi-account-cancel</v-icon>
                        </v-btn>
                      </td>
                      <td v-else-if="notification.type === 'broadcast'">
                        <v-btn icon :href="notification.link">
                          <v-icon>mdi-link</v-icon>
                        </v-btn>
                        <v-btn icon @click="deleteNotification(index)">
                          <v-icon>mdi-trash-can</v-icon>
                        </v-btn>
                      </td>
                      <td v-else-if="notification.type === 'charisma'">
                        <v-btn icon @click="deleteNotification(index)">
                          <v-icon>mdi-trash-can</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card-text>

            <template v-if="hasRole(['admin', 'bureau'])">
              <v-card-title
                >{{ notValidatedCount }} Orgas non validés
              </v-card-title>
            </template>

            <v-card-actions>
              <v-btn
                v-if="hasRole('hard')"
                text
                @click="isBroadcastDialogOpen = true"
                >broadcast
              </v-btn>
              <v-btn v-if="hasRole(['admin', 'bureau'])" text to="/humans"
                >Liste des Orgas
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col v-if="hasRole('hard')" cols="12" sm="6" md="4">
          <v-card v-if="user">
            <v-card-title>Compte Perso 💰</v-card-title>
            <v-card-subtitle
              >Balance : {{ user.balance || 0 }} €
            </v-card-subtitle>
            <v-card-text v-if="user.transactionHistory">
              <v-simple-table>
                <thead>
                  <tr>
                    <th class="text-left">Operation</th>
                    <th class="text-right">€</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, i2) in displayedTransactionHistory"
                    :key="i2"
                  >
                    <td>{{ item.reason }}</td>
                    <td class="text-right">{{ item.amount }} €</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-card-text>
            <v-card-actions>
              <v-btn text @click="isTransferDialogOpen = true"
                >Effectuer un virement</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <v-card v-if="user">
            <v-card-title>Amis ❤️</v-card-title>
            <v-card-text>
              <v-list dense>
                <v-list-item-group>
                  <v-list-item
                    v-for="item in user.friends"
                    :key="item.username"
                  >
                    <v-list-item-content>
                      <v-list-item-title>{{ item.username }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
              <v-container v-if="!user.friends || !user.friends.length">
                <v-img
                  src="https://media.giphy.com/media/ISOckXUybVfQ4/giphy.gif"
                ></v-img>
                <p>
                  Pour demander un orga (ou un soft) en ami, mets le prénom.nom
                  de tes potes !
                </p>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-autocomplete
                v-model="newFriend"
                label="prénom.nom de ton pote"
                :items="usernames"
              ></v-autocomplete>
              <v-btn text @click="sendFriendRequest">demander en ami</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col cols="12" sm="6" md="4">
          <v-card v-if="user">
            <v-card-title>Le Clicker ⏱</v-card-title>
            <v-card-subtitle
              >Le compteur de blagues qui dérapent 🚗
            </v-card-subtitle>
            <v-card-text>
              <h2>{{ user.clicks || 0 }} 🚗</h2>
            </v-card-text>
            <v-card-actions>
              <v-btn text @click="clicker()">click</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-snackbar v-model="isSnackbarOpen" :timeout="5000">
      {{ snackbarMessage }}
    </v-snackbar>

    <v-dialog v-model="isBroadcastDialogOpen" max-width="600">
      <v-card>
        <v-card-title>Envoyer un message a l'asso</v-card-title>
        <v-card-text>
          <v-text-field v-model="notification.link" label="lien"></v-text-field>
          <v-autocomplete
            v-model="notification.team"
            label="team"
            :items="getConfig('teams').map((e) => e.name)"
          ></v-autocomplete>
          <v-text-field
            v-model="notification.message"
            label="message"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="broadcast">📣</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="hasNotBeenApproved" max-width="600" persistent>
      <v-card>
        <v-card-title>Oupsss</v-card-title>
        <v-card-text>
          Merci de rejoindre l'asso mais il faut qu'un admin active ton compte
          (demande à Maëlle)..
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="logout">DECONNEXION</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isPPDialogOpen" max-width="600">
      <v-card>
        <v-card-text>
          <v-file-input v-model="PP"> </v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="uploadPP()">Enregistrer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isTransferDialogOpen" max-width="600">
      <v-card>
        <v-card-title>Effectuer un virement</v-card-title>
        <v-card-text>
          <OverForm :fields="transferForm" @form-change="onFormChange">
          </OverForm>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="transferMoney()">Enregistrer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { getConfig, getUser, hasRole } from "../common/role";
import OverChips from "../components/overChips";
import OverForm from "../components/overForm";

const SNACKBAR_MESSAGES = {
  friendRequest: {
    sent: "votre demande d'ami a été envoyée",
    accepted: "T'as un nouvel ami",
    refused: "je suis d'accord c'est un batard",
    lonely: "t'es seul a ce point là 🥺 ?",
    alreadyFriend: "t'es deja ami avec ",
  },
  error: "🥵 sheeshh une erreur ",
  broadcasted: "broadcast envoyé 📣",
  imageUpdated: "image sauvgardée, rafraichissez la page pour la voir",
};

export default {
  components: { OverForm, OverChips },

  data() {
    return {
      user: undefined,
      newFriend: undefined,
      isSnackbarOpen: false,
      isBroadcastDialogOpen: false,
      isPPDialogOpen: false,
      isTransferDialogOpen: false,
      notValidatedCount: 0,
      transferForm: [
        {
          key: "user",
          type: "user",
          isRequired: true,
        },
        {
          key: "amount",
          label: "montant",
          isRequired: true,
        },
        {
          key: "reason",
          label: "raison",
        },
      ],
      transfer: {
        reason: "",
        amount: undefined,
        beneficiary: undefined,
      },
      hasNotBeenApproved: false,
      PP: undefined,
      usernames: [],
      snackbarMessage: "",
      SNACKBAR_MESSAGES,
      notification: {
        link: undefined,
        message: undefined,
        team: undefined,
      },
    };
  },

  computed: {
    displayedTransactionHistory() {
      let result = [];
      if (this.user && this.user.transactionHistory) {
        let fullTransactionHistory = this.user.transactionHistory;
        fullTransactionHistory.forEach((transaction) => {
          if (result.length < 3) {
            result.push(transaction);
          }
        });
      }
      return result;
    },
  },

  async mounted() {
    this.user = await getUser(this);

    this.usernames = (await this.$axios.get("/user/all")).data;

    this.notValidatedCount = await this.getNotValidatedCount();

    if (this.user.team === undefined || this.user.team.length === 0) {
      this.hasNotBeenApproved = true;
    }
  },

  methods: {
    getConfig(key) {
      return getConfig(this, key);
    },

    async getNotValidatedCount() {
      let { data: users } = await this.$axios.get("/user");
      return users.filter((user) => user.team.length === 0).length;
    },

    async broadcast() {
      this.notification.date = new Date();
      this.notification.type = "broadcast";
      await this.$axios.post("/user/broadcast", this.notification);
      this.snackbarMessage = this.SNACKBAR_MESSAGES.broadcasted;
      this.isSnackbarOpen = true;
      this.isBroadcastDialogOpen = false;
    },

    deleteNotification(index) {
      let { keycloakID, notifications } = this.user;
      notifications.splice(index, index + 1);
      this.$axios.put(`/user/${keycloakID}`, { notifications });
    },

    hasRole(team) {
      return hasRole(this, team);
    },

    async uploadPP() {
      let form = new FormData();
      form.append("files", this.PP, this.PP.name);
      form.append("_id", getUser(this)._id);
      await this.$axios.post("/user/pp", form);
      this.isPPDialogOpen = false;
      this.snackbarMessage = this.SNACKBAR_MESSAGES.imageUpdated;
      this.isSnackbarOpen = true;
    },

    getNotificationIcon(notificationType) {
      const NOTIFICATIONS_ICONS = {
        friendRequest: "👨‍👩‍👧",
        broadcast: "📣",
        charisma: "😎",
      };
      return NOTIFICATIONS_ICONS[notificationType] || "📣";
    },

    onFormChange(form) {
      this.transfer = form;
    },

    async clicker() {
      if (this.user.clicks === undefined) {
        this.user.clicks = 0;
      }
      this.user.clicks += 1;
      this.$set(this.user, "clicks", this.user.clicks); // force update
      await this.$axios.put(`/user/${this.user.keycloakID}`, {
        clicks: this.user.clicks,
      });
    },

    async sendFriendRequest() {
      const user = getUser(this);
      let [firstname, lastname] = this.newFriend.split(".");
      if (firstname === user.firstname && lastname === user.lastname) {
        // asked himself to be friend
        this.snackbarMessage = this.SNACKBAR_MESSAGES.friendRequest.lonely;
        this.isSnackbarOpen = true;
        window.open(
          "https://www.santemagazine.fr/psycho-sexo/psycho/10-facons-de-se-faire-des-amis-178690"
        );
        return;
      }
      if (
        this.user.friends.find((friend) => friend.username === this.newFriend)
      ) {
        // already friends
        this.snackbarMessage =
          this.SNACKBAR_MESSAGES.friendRequest.alreadyFriend + this.newFriend;
        this.isSnackbarOpen = true;
        return;
      }
      await this.$axios.put(`/user/notification/${lastname}/${firstname}`, {
        type: "friendRequest",
        message: `${getUser(this).lastname} ${
          getUser(this).firstname
        } vous a envoye une demande d'ami ❤️`,
        from: `${
          getUser(this).nickname
            ? getUser(this).nickname
            : getUser(this).lastname
        }`,
        date: new Date(),
        data: {
          username: `${getUser(this).firstname}.${getUser(this).lastname}`,
          id: getUser(this)._id,
        },
      });
      this.snackbarMessage = this.SNACKBAR_MESSAGES.friendRequest.sent;
      this.isSnackbarOpen = true;
    },

    async acceptFriendRequest(notification) {
      if (notification.data) {
        let user = getUser(this);
        user.notifications.pop();
        await this.$axios.post(`/user/friends`, {
          from: user._id,
          to: notification.data,
        });
        this.snackbarMessage = this.SNACKBAR_MESSAGES.friendRequest.accepted;
        this.isSnackbarOpen = true;
      } else {
        this.snackbarMessage = this.SNACKBAR_MESSAGES.error;
        this.isSnackbarOpen = true;
      }
    },

    async refuseFriendRequest(notification) {
      if (notification.data) {
        let friends;
        let user = getUser(this);
        if (user.friends === undefined) {
          friends = [];
        } else {
          friends = user.friends;
        }
        user.notifications.pop();
        await this.$axios.put(`/user/${user.keycloakID}`, user);
        this.snackbarMessage = this.SNACKBAR_MESSAGES.friendRequest.accepted;
        this.isSnackbarOpen = true;
      } else {
        this.snackbarMessage = this.SNACKBAR_MESSAGES.error;
        this.isSnackbarOpen = true;
      }
    },

    getPPUrl() {
      return process.env.NODE_ENV === "development"
        ? "http://localhost:2424/"
        : "";
    },

    async logout() {
      await this.$auth.logout();
      await this.$router.push({
        path: "/login",
      });
    },

    async transferMoney() {
      this.transfer.amount = this.transfer.amount.replace(",", ".");
      if (this.transfer.isValid) {
        if (
          this.transfer.user ===
          this.user.firstname + "." + this.user.lastname
        ) {
          return;
        }
        this.user.balance -= +this.transfer.amount;
        if (!this.user.transactionHistory) {
          this.user.transactionHistory = [];
        }
        this.user.transactionHistory.unshift({
          amount: this.transfer.amount,
          reason: `virement pour ${this.transfer.user}, ${this.transfer.reason}`,
        });

        // save user balance
        await this.$axios.$post("user/transfer", this.transfer);
        this.isTransferDialogOpen = false;
      }
    },
  },
};
</script>
<style></style>
