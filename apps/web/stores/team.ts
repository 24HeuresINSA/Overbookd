import {
  requirableTeams,
  requirableTeamsExtended,
} from "@overbookd/festival-event";
import type { Team } from "@overbookd/http";
import { AFFECT_VOLUNTEER } from "@overbookd/permission";
import { isSuccess } from "~/utils/http/api-fetch";
import { sendNotification } from "~/utils/notification/send-notification";

type State = {
  teams: Team[];
  faReviewers: Team[];
  ftReviewers: Team[];
};

export const useTeamStore = defineStore("team", {
  state: (): State => ({
    teams: [],
    faReviewers: [],
    ftReviewers: [],
  }),
  getters: {
    getTeamByCode:
      (state) =>
        (code: string): Team | undefined => {
          return state.teams.find((team) => team.code === code);
        },
    mobilizableTeams(state): Team[] {
      const userStore = useUserStore();
      const mobilizableTeams = userStore.can(AFFECT_VOLUNTEER)
        ? requirableTeamsExtended
        : requirableTeams;

      return state.teams.filter((team) =>
        mobilizableTeams.some((t) => t === team.code),
      );
    },
  },
  actions: {
    async fetchTeams(): Promise<void> {
      const res = await TeamRepository.getTeams();
      if (!isSuccess(res)) return;
      this.teams = res;
    },

    async fetchFaReviewers(): Promise<void> {
      const res = await TeamRepository.getFaReviewers();
      if (!isSuccess(res)) return;
      this.faReviewers = res;
    },

    async fetchFtValidators(): Promise<void> {
      const res = await TeamRepository.getFtReviewers();
      if (!isSuccess(res)) return;
      this.ftReviewers = res;
    },

    async createTeam(team: Team): Promise<void> {
      const res = await TeamRepository.createTeam(team);
      if (!isSuccess(res)) return;
      sendNotification("Equipe créée avec succès ✅");
      await this.fetchTeams();
    },

    async updateTeam(team: Team): Promise<void> {
      const res = await TeamRepository.updateTeam(team);
      if (!isSuccess(res)) return;
      sendNotification("Equipe modifiée avec succès ✅");
      await this.fetchTeams();
    },

    async removeTeam({ code }: Team): Promise<void> {
      const res = await TeamRepository.deleteTeam(code);
      if (!isSuccess(res)) return;
      sendNotification("Equipe supprimée avec succès ✅");
      await this.fetchTeams();
    },
  },
});
