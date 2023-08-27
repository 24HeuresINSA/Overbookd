import {
  IDefineANewcomer,
  JoinableTeam,
  RegisterForm,
} from "@overbookd/registration";
import { actionTree, mutationTree } from "typed-vuex";
import {
  FakeRegistrationRepository,
  RegistrationRepository,
} from "~/repositories/registration.repository";
import { HttpStringified } from "~/utils/types/http";
import { RepoFactory } from "~/repositories/repo-factory";
import { safeCall } from "~/utils/api/calls";

type State = {
  newcomers: IDefineANewcomer[];
  inviteNewAdherentLink?: URL;
};

const fakeRegistrationRepo = FakeRegistrationRepository;
const registrationRepo = RegistrationRepository;
const configurationRepo = RepoFactory.ConfigurationRepository;

const INVITE_NEW_ADHERENT_LINK = "inviteNewAdherentLink";

export const state = (): State => ({
  newcomers: [],
  inviteNewAdherentLink: undefined,
});

export const mutations = mutationTree(state, {
  SET_NEWCOMERS(state, newcomers: IDefineANewcomer[]) {
    state.newcomers = newcomers;
  },
  REMOVE_ENROLLED_NEWCOMERS(state, newcomers: IDefineANewcomer[]) {
    state.newcomers = state.newcomers.filter(
      (newcomer) =>
        !newcomers.some(
          (enrolledNewcomer) => enrolledNewcomer.id === newcomer.id,
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
    async getNewcomers({ commit }) {
      const res = await fakeRegistrationRepo.getNewcomers(this);
      commit("SET_NEWCOMERS", castNewcomersWithDate(res));
    },

    async enrollNewcomers(
      { commit },
      {
        team,
        newcomers,
      }: { team: JoinableTeam; newcomers: IDefineANewcomer[] },
    ) {
      const body = {
        newcomers: newcomers.map(({ id }) => ({ id })),
        team,
      };
      const res = await safeCall(
        this,
        registrationRepo.enrollNewcomers(this, body),
        {
          successMessage: `Les nouveaux arrivants sélectionnés ont bien été ajoutés à l'équipe ${team}`,
          errorMessage: `Les nouveaux arrivants sélectionnés n'ont pas pu être ajoutés à l'équipe ${team}`,
        },
      );
      if (!res) return;
      commit("REMOVE_ENROLLED_NEWCOMERS", newcomers);
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
  },
);

function castNewcomersWithDate(
  newcomers: HttpStringified<IDefineANewcomer[]>,
): IDefineANewcomer[] {
  return newcomers.map((newcomer) => ({
    ...newcomer,
    registeredAt: new Date(newcomer.registeredAt),
  }));
}
