import { RegisterForm } from "@overbookd/registration";
import { actionTree, mutationTree } from "typed-vuex";
import { EnrollableAdherent, HttpStringified } from "@overbookd/http";
import { RepoFactory } from "~/repositories/repo-factory";
import { safeCall } from "~/utils/api/calls";
import { Credentials } from "@overbookd/registration";

type State = {
  adherents: EnrollableAdherent[];
  inviteNewAdherentLink?: URL;
};

const registrationRepo = RepoFactory.RegistrationRepository;
const configurationRepo = RepoFactory.ConfigurationRepository;

const INVITE_NEW_ADHERENT_LINK = "inviteNewAdherentLink";

export const state = (): State => ({
  adherents: [],
  inviteNewAdherentLink: undefined,
});

export const mutations = mutationTree(state, {
  SET_ADHERENTS(state, newcomers: EnrollableAdherent[]) {
    state.adherents = newcomers;
  },
  REMOVE_ENROLLED_NEWCOMERS(state, enrolled: EnrollableAdherent[]) {
    state.adherents = state.adherents.filter(
      (adherents) =>
        !enrolled.some(
          (enrolledNewcomer) => enrolledNewcomer.id === adherents.id,
        ),
    );
  },
  SET_INVITE_NEW_ADHERENT_LINK(state, link: URL) {
    state.inviteNewAdherentLink = link;
  },
  REMOVE_INVITE_NEW_ADHERENT_LINK(state) {
    state.inviteNewAdherentLink = undefined;
  },
});

export const actions = actionTree(
  { state },
  {
    async getAdherents({ commit }) {
      const res = await registrationRepo.getAdherents(this);
      if (!res) return;
      commit("SET_ADHERENTS", castAdherentsWithDate(res.data));
    },

    async enrollNewAdherents({ commit }, adherents: EnrollableAdherent[]) {
      const res = await safeCall(
        this,
        registrationRepo.enrollNewAdherents(this, adherents),
        {
          successMessage:
            "Les nouveaux arrivants sélectionnés ont bien été enrôlés en tant que hards ✅",
          errorMessage:
            "Les nouveaux arrivants sélectionnés n'ont pas pu être enrôlés ❌",
        },
      );
      if (!res) return;
      commit("REMOVE_ENROLLED_NEWCOMERS", adherents);
    },

    async fetchInviteNewAdherentLink({ commit }) {
      const res = await safeCall(
        this,
        configurationRepo.fetch(this, INVITE_NEW_ADHERENT_LINK),
      );
      if (!res || !res.data) return;
      const link = new URL(res.data.value.toString());
      commit("SET_INVITE_NEW_ADHERENT_LINK", link);
    },

    async generateInviteNewAdherentLink({ dispatch }) {
      const res = await safeCall(this, registrationRepo.generateLink(this));
      if (!res) return;
      dispatch("updateInviteNewAdherentLink", new URL(res.data));
    },

    async updateInviteNewAdherentLink({ commit }, link: URL) {
      const res = await safeCall(
        this,
        configurationRepo.save(this, {
          key: INVITE_NEW_ADHERENT_LINK,
          value: link.href,
        }),
      );
      if (!res) return;
      commit("SET_INVITE_NEW_ADHERENT_LINK", link);
    },

    async register(_, { token, form }: { token?: string; form: RegisterForm }) {
      return safeCall(
        this,
        registrationRepo.registerNewcomer(this, form, token),
      );
    },

    async forgetMe(
      _,
      { credentials, token }: { credentials: Credentials; token: string },
    ) {
      await safeCall(
        this,
        registrationRepo.forgetMe(this, credentials, token),
        {
          successMessage:
            "Les informations liées à ce compte sont supprimées 🗑️",
        },
      );
    },

    async forgetHim({ dispatch }, email: string) {
      const res = await safeCall(this, registrationRepo.forgetHim(this, email));
      if (!res) return;
      dispatch("getAdherents");
    },
  },
);

function castAdherentsWithDate(
  adherents: HttpStringified<EnrollableAdherent[]>,
): EnrollableAdherent[] {
  return adherents.map((adherent) => ({
    ...adherent,
    registeredAt: new Date(adherent.registeredAt),
  }));
}
